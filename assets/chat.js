// Weblume live chat widget (visitor side). Messages are stored in Firestore:
//   chats/{visitorUid}            -> name, lastMessage, updatedAt, unreadAdmin, linksAllowed (admin only)
//   chats/{visitorUid}/messages   -> from: 'visitor' | 'admin', text, image (data URL, optional), at
//   meta/status                   -> online, at   (written by the admin page)
import { firebaseConfig, FIREBASE_SDK, isConfigured } from './firebase-config.js?v=4';

const FALLBACK = 'https://ig.me/m/weblume1';
const NTFY_TOPIC = 'weblume-chat-k7q2x9m4';          // phone alerts via the ntfy app
const ADMIN_URL = 'https://weblume-sa.github.io/admin/';
const NAME_KEY = 'wl-chat-name';
const STARTED_KEY = 'wl-chat-started';
const MAX_IMAGE_CHARS = 850000;                       // keeps each message under Firestore's 1 MB limit
const LINK_RE = /(https?:\/\/|www\.)|\b[a-z0-9-]+\.(com|net|org|io|me|sa|eg|ly|co|link|xyz|info|app|dev|site|store|online|gg|tk|ru|biz|us|uk|ae|shop|top|click|live|tv|page|cc|ws|to)\b/i;

const T = {
  ar: {
    online: 'أونلاين دلوقتي', away: 'هنرد عليك في أقرب وقت',
    hello: 'أهلاً بيك في Weblume! محتاج موقع لإيه؟ اكتبلنا أو ابعت صورة وهنرد عليك هنا.',
    namePh: 'اسمك', start: 'ابدأ المحادثة', nameErr: 'اكتب اسمك عشان نعرف بنكلم مين',
    msgPh: 'اكتب رسالتك…', send: 'إرسال', close: 'إغلاق', photo: 'إرسال صورة',
    failed: 'الرسالة متبعتتش، دوس هنا وجرّب تاني', noLinks: 'مش مسموح بإرسال لينكات في الشات.',
    badImg: 'الملف ده مش صورة', bigImg: 'الصورة كبيرة أوي، جرّب صورة تانية', photoLbl: '📷 صورة'
  },
  en: {
    online: 'Online now', away: "We'll reply as soon as we can",
    hello: 'Welcome to Weblume! What kind of website do you need? Send a message or a photo and we will reply right here.',
    namePh: 'Your name', start: 'Start chatting', nameErr: 'Add your name so we know who we are talking to',
    msgPh: 'Type your message…', send: 'Send', close: 'Close', photo: 'Send a photo',
    failed: "Message wasn't sent, tap to retry", noLinks: "Links can't be sent in this chat.",
    badImg: "That file isn't an image", bigImg: 'That image is too large, try another one', photoLbl: '📷 Photo'
  }
};
const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ar');
const t = k => T[lang()][k];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

/* ---------- styles ---------- */
const css = `
.wlc{position:fixed;inset:0;z-index:80;display:flex;justify-content:center;background:#050505;font-family:var(--body,'IBM Plex Sans Arabic',sans-serif);color:#f7f5f2;opacity:0;visibility:hidden;transform:translateY(18px);transition:opacity .25s,transform .3s cubic-bezier(.2,.7,.2,1),visibility 0s .3s}
.wlc.open{opacity:1;visibility:visible;transform:none;transition:opacity .25s,transform .3s cubic-bezier(.2,.7,.2,1)}
.wlc-col{width:100%;max-width:820px;height:100%;display:flex;flex-direction:column;position:relative;background:#0b0b0b;border-inline:1px solid rgba(255,255,255,.06)}
.wlc-hd{display:flex;align-items:center;gap:14px;padding:12px 18px;padding-top:max(12px,env(safe-area-inset-top));background:linear-gradient(180deg,rgba(212,24,42,.18),rgba(212,24,42,0));border-bottom:1px solid rgba(255,255,255,.08)}
.wlc-logo{height:52px;width:auto;flex:none}
.wlc-st{flex:1;display:flex;align-items:center;gap:8px;font-size:13px;color:#a7a39e;min-width:0}
.wlc-st i{width:9px;height:9px;border-radius:50%;background:#6b6b6b;flex:none}
.wlc.is-online .wlc-st i{background:#3ddc84;box-shadow:0 0 0 3px rgba(61,220,132,.2)}
.wlc-x{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#f7f5f2;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none}
.wlc-x:hover{border-color:#d4182a}
.wlc-x svg{width:18px;height:18px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round}
.wlc-body{flex:1;overflow-y:auto;padding:20px 18px;display:flex;flex-direction:column;gap:8px;overscroll-behavior:contain}
.wlc-m{max-width:78%;padding:9px 13px;border-radius:16px;font-size:15px;line-height:1.65;white-space:pre-wrap;word-wrap:break-word}
.wlc-m.wlc-them{align-self:flex-start;background:#1c1c1c;border:1px solid rgba(255,255,255,.07);border-start-start-radius:5px}
.wlc-m.wlc-me{align-self:flex-end;background:#d4182a;color:#fff;border-start-end-radius:5px}
.wlc-m.wlc-pend{opacity:.6}
.wlc-m.wlc-err{background:transparent;border:1px solid #d4182a;color:#ff8a94;cursor:pointer}
.wlc-m a{color:inherit;text-decoration:underline}
.wlc-m.wlc-img{padding:4px;background:#1c1c1c}
.wlc-m.wlc-me.wlc-img{background:#d4182a}
.wlc-m img{display:block;max-width:100%;max-height:300px;border-radius:12px;cursor:zoom-in}
.wlc-m img+span{display:block;padding:6px 8px 2px}
.wlc-time{font-size:11.5px;color:#77736f;align-self:center;margin:8px 0 2px}
.wlc-note{align-self:center;font-size:13px;color:#ff8a94;background:rgba(212,24,42,.1);border:1px solid rgba(212,24,42,.35);border-radius:999px;padding:6px 14px;display:none}
.wlc-note.show{display:block}
.wlc-name{padding:16px 18px;padding-bottom:max(16px,env(safe-area-inset-bottom));border-top:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:10px}
.wlc-name small{color:#ff8a94;font-size:12.5px;display:none}
.wlc-name.bad small{display:block}
.wlc-in{width:100%;background:#141414;border:1px solid rgba(255,255,255,.12);color:#f7f5f2;border-radius:14px;padding:12px 14px;font:inherit;font-size:16px;outline:none}
.wlc-in:focus{border-color:#d4182a}
.wlc-go{height:48px;border:0;border-radius:999px;background:#d4182a;color:#fff;font:inherit;font-weight:600;font-size:15px;cursor:pointer}
.wlc-go:hover{background:#ef2336}
.wlc-cmp{display:none;align-items:flex-end;gap:8px;padding:10px 14px;padding-bottom:max(10px,env(safe-area-inset-bottom));border-top:1px solid rgba(255,255,255,.08)}
.wlc.named .wlc-cmp{display:flex}
.wlc.named .wlc-name{display:none}
.wlc-cmp textarea{flex:1;resize:none;max-height:140px;min-height:48px;line-height:1.5}
.wlc-btn{width:48px;height:48px;flex:none;border-radius:50%;border:0;background:#d4182a;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}
.wlc-btn:hover{background:#ef2336}
.wlc-btn.ghost{background:#141414;border:1px solid rgba(255,255,255,.12)}
.wlc-btn.ghost:hover{border-color:#d4182a;background:#141414}
.wlc-btn svg{width:21px;height:21px;fill:none;stroke:#fff;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
html[dir="rtl"] .wlc-snd svg{transform:scaleX(-1)}
.wlc-file{display:none}
.wlc-lb{position:absolute;inset:0;z-index:5;background:rgba(0,0,0,.92);display:none;align-items:center;justify-content:center;padding:20px;cursor:zoom-out}
.wlc-lb.show{display:flex}
.wlc-lb img{max-width:100%;max-height:100%;border-radius:10px}
html.wlc-lock,html.wlc-lock body{overflow:hidden}
@media (max-width:520px){.wlc-logo{height:44px}.wlc-hd{padding-inline:14px}.wlc-body{padding-inline:12px}.wlc-m{max-width:86%}}
`;
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

/* ---------- markup ---------- */
const box = document.createElement('div');
box.className = 'wlc';
box.setAttribute('role', 'dialog');
box.setAttribute('aria-modal', 'true');
box.setAttribute('aria-hidden', 'true');
box.innerHTML = `
  <div class="wlc-col">
    <div class="wlc-hd">
      <img class="wlc-logo" src="assets/weblume-logo-sm.webp" alt="Weblume">
      <div class="wlc-st"><i></i><span data-k="away"></span></div>
      <button class="wlc-x" type="button" data-k-aria="close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="wlc-body" aria-live="polite"></div>
    <form class="wlc-name" novalidate>
      <input class="wlc-in" maxlength="60" autocomplete="name" data-k-ph="namePh">
      <small data-k="nameErr"></small>
      <button class="wlc-go" type="submit" data-k="start"></button>
    </form>
    <form class="wlc-cmp" novalidate>
      <button class="wlc-btn ghost wlc-att" type="button" data-k-aria="photo"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/></svg></button>
      <input class="wlc-file" type="file" accept="image/*">
      <textarea class="wlc-in" rows="1" maxlength="1500" data-k-ph="msgPh"></textarea>
      <button class="wlc-btn wlc-snd" type="submit" data-k-aria="send"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
    </form>
    <div class="wlc-lb"><img alt=""></div>
  </div>`;
document.body.appendChild(box);

const $ = s => box.querySelector(s);
const body = $('.wlc-body'), nameForm = $('.wlc-name'), nameIn = $('.wlc-name input');
const cmp = $('.wlc-cmp'), msgIn = $('.wlc-cmp textarea'), statusEl = $('.wlc-st span');
const fileIn = $('.wlc-file'), lb = $('.wlc-lb');
const fab = document.getElementById('chatFab');
const fabCnt = document.getElementById('chatCnt');

/* ---------- state ---------- */
let fb = null;          // loaded Firebase modules + handles
let online = false;
let linksAllowed = false;
let messages = [];      // from Firestore
let pending = [];       // optimistic, not yet confirmed
let note = '';          // inline warning (links / image problems)
let isOpen = false;
let seenAdmin = -1;     // count of admin messages already seen

if (store.get(NAME_KEY)) box.classList.add('named');

function applyTexts() {
  box.querySelectorAll('[data-k]').forEach(el => { el.textContent = t(el.dataset.k); });
  box.querySelectorAll('[data-k-ph]').forEach(el => { el.placeholder = t(el.dataset.kPh); });
  box.querySelectorAll('[data-k-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.kAria)));
  statusEl.textContent = t(online ? 'online' : 'away');
  render();
}
new MutationObserver(applyTexts).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

/* ---------- rendering ---------- */
function linkify(el, text) {
  const re = /(https?:\/\/[^\s]+)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    el.appendChild(document.createTextNode(text.slice(last, m.index)));
    const a = document.createElement('a');
    a.href = m[1]; a.target = '_blank'; a.rel = 'noopener nofollow'; a.textContent = m[1];
    el.appendChild(a);
    last = m.index + m[1].length;
  }
  el.appendChild(document.createTextNode(text.slice(last)));
}
function bubble(msg, cls, trusted) {
  const el = document.createElement('div');
  el.className = 'wlc-m ' + cls + (msg.image ? ' wlc-img' : '');
  const fill = (node, text) => { if (trusted) linkify(node, text); else node.textContent = text; };
  if (msg.image) {
    const img = document.createElement('img');
    img.src = msg.image; img.alt = ''; img.loading = 'lazy';
    img.addEventListener('click', e => { e.stopPropagation(); lb.querySelector('img').src = msg.image; lb.classList.add('show'); });
    el.appendChild(img);
    if (msg.text) { const s = document.createElement('span'); fill(s, msg.text); el.appendChild(s); }
  } else if (msg.text) {
    fill(el, msg.text);
  }
  return el;
}
function render() {
  body.textContent = '';
  body.appendChild(bubble({ text: t('hello') }, 'wlc-them'));
  let lastDay = '';
  messages.forEach(m => {
    const d = m.at && m.at.toDate ? m.at.toDate() : null;
    if (d && d.toDateString() !== lastDay) {
      lastDay = d.toDateString();
      const tm = document.createElement('div');
      tm.className = 'wlc-time';
      tm.textContent = d.toLocaleDateString(lang() === 'en' ? 'en-US' : 'ar-EG', { weekday: 'long', day: 'numeric', month: 'short' });
      body.appendChild(tm);
    }
    const admin = m.from === 'admin';
    body.appendChild(bubble(m, admin ? 'wlc-them' : 'wlc-me', admin));
  });
  pending.forEach(p => {
    const el = bubble(p.failed ? { text: t('failed') + (p.text ? '\n' + p.text : ''), image: p.image } : p, 'wlc-me ' + (p.failed ? 'wlc-err' : 'wlc-pend'));
    if (p.failed) el.addEventListener('click', () => { pending = pending.filter(x => x !== p); send(p.text, p.image); });
    body.appendChild(el);
  });
  const n = document.createElement('div');
  n.className = 'wlc-note' + (note ? ' show' : '');
  n.textContent = note;
  body.appendChild(n);
  body.scrollTop = body.scrollHeight;
}
function setNote(msg) {
  note = msg;
  render();
  clearTimeout(setNote.tm);
  if (msg) setNote.tm = setTimeout(() => { note = ''; render(); }, 5000);
}
function setUnread(n) {
  if (!fab) return;
  fabCnt.textContent = n > 9 ? '9+' : String(n);
  fab.classList.toggle('has-unread', n > 0);
}

/* ---------- phone alert (ntfy) ---------- */
function alertPhone(text, hasImage) {
  try {
    fetch('https://ntfy.sh/', {
      method: 'POST',
      body: JSON.stringify({
        topic: NTFY_TOPIC,
        title: 'رسالة جديدة من ' + (store.get(NAME_KEY) || 'زائر'),
        message: (hasImage ? '📷 صورة ' : '') + (text || '').slice(0, 300),
        tags: ['speech_balloon'],
        priority: 4,
        click: ADMIN_URL
      }),
      keepalive: true
    }).catch(() => {});
  } catch (e) {}
}

/* ---------- firebase ---------- */
async function connect() {
  if (fb) return fb.ready;
  fb = {};
  fb.ready = (async () => {
    const [appM, authM, fsM] = await Promise.all([
      import(`${FIREBASE_SDK}/firebase-app.js`),
      import(`${FIREBASE_SDK}/firebase-auth.js`),
      import(`${FIREBASE_SDK}/firebase-firestore.js`)
    ]);
    const app = appM.initializeApp(firebaseConfig);
    const auth = authM.getAuth(app);
    const db = fsM.getFirestore(app);
    await authM.setPersistence(auth, authM.browserLocalPersistence).catch(() => {});
    const user = await new Promise(res => { const u = authM.onAuthStateChanged(auth, x => { u(); res(x); }); });
    const cred = user ? { user } : await authM.signInAnonymously(auth);
    const uid = cred.user.uid;
    Object.assign(fb, { fsM, db, uid, chatRef: fsM.doc(db, 'chats', uid) });
    fb.msgsRef = fsM.collection(fb.chatRef, 'messages');

    fsM.onSnapshot(fsM.doc(db, 'meta', 'status'), s => {
      const d = s.data();
      online = Boolean(d && d.online && d.at && Date.now() - d.at.toMillis() < 3 * 60 * 1000);
      box.classList.toggle('is-online', online);
      statusEl.textContent = t(online ? 'online' : 'away');
    }, () => {});

    if (store.get(STARTED_KEY)) listen();
    return fb;
  })();
  return fb.ready;
}

function listen() {
  if (fb.listening) return;
  fb.listening = true;
  const { fsM } = fb;
  fsM.onSnapshot(fb.chatRef, s => { linksAllowed = Boolean(s.exists() && s.data().linksAllowed); }, () => {});
  fsM.onSnapshot(fsM.query(fb.msgsRef, fsM.orderBy('at', 'asc')), snap => {
    messages = snap.docs.map(d => d.data());
    const admins = messages.filter(m => m.from === 'admin').length;
    if (seenAdmin < 0 || isOpen) seenAdmin = admins;
    setUnread(Math.max(0, admins - seenAdmin));
    render();
  }, () => {});
}

async function ensureChat() {
  const { fsM } = fb;
  if (store.get(STARTED_KEY)) return;
  try {
    await fsM.setDoc(fb.chatRef, {
      name: store.get(NAME_KEY) || '',
      lang: lang(),
      createdAt: fsM.serverTimestamp(),
      updatedAt: fsM.serverTimestamp(),
      lastMessage: '',
      lastFrom: 'visitor',
      unreadAdmin: 0
    });
  } catch (e) { /* chat already exists for this visitor */ }
  store.set(STARTED_KEY, '1');
  listen();
}

async function send(text, image) {
  text = String(text || '').trim().slice(0, 1500);
  if (!text && !image) return;
  if (text && LINK_RE.test(text) && !linksAllowed) { setNote(t('noLinks')); return false; }
  const p = { text, image };
  pending.push(p);
  render();
  try {
    await connect();
    await ensureChat();
    const { fsM } = fb;
    const msg = { from: 'visitor', text, at: fsM.serverTimestamp() };
    if (image) msg.image = image;
    await fsM.addDoc(fb.msgsRef, msg);
    await fsM.updateDoc(fb.chatRef, {
      updatedAt: fsM.serverTimestamp(),
      lastMessage: (image ? T.ar.photoLbl + ' ' : '') + text.slice(0, 140),
      lastFrom: 'visitor',
      unreadAdmin: fsM.increment(1)
    });
    pending = pending.filter(x => x !== p);
    alertPhone(text, Boolean(image));
  } catch (e) {
    p.failed = true;
    console.error('Weblume chat:', e);
  }
  render();
  return true;
}

/* ---------- images: shrink in the browser before sending ---------- */
function loadImage(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('bad image')); };
    img.src = url;
  });
}
async function compress(file) {
  const img = await loadImage(file);
  let max = 1400, q = 0.82, out = '';
  for (let i = 0; i < 8; i++) {
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.naturalWidth * s));
    c.height = Math.max(1, Math.round(img.naturalHeight * s));
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    out = c.toDataURL('image/jpeg', q);
    if (out.length <= MAX_IMAGE_CHARS) return out;
    max = Math.round(max * 0.8); q = Math.max(0.5, q - 0.07);
  }
  throw new Error('too big');
}
$('.wlc-att').addEventListener('click', () => fileIn.click());
fileIn.addEventListener('change', async () => {
  const f = fileIn.files && fileIn.files[0];
  fileIn.value = '';
  if (!f) return;
  if (!/^image\//.test(f.type)) { setNote(t('badImg')); return; }
  try {
    const data = await compress(f);
    const caption = msgIn.value.trim();
    if (caption && LINK_RE.test(caption) && !linksAllowed) { setNote(t('noLinks')); return; }
    msgIn.value = ''; msgIn.style.height = '';
    send(caption, data);
  } catch (e) {
    setNote(t(e.message === 'too big' ? 'bigImg' : 'badImg'));
  }
});
lb.addEventListener('click', () => lb.classList.remove('show'));

/* ---------- open / close ---------- */
function open() {
  if (!isConfigured()) { window.open(FALLBACK, '_blank', 'noopener'); return; }
  isOpen = true;
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('wlc-lock');
  if (fab) fab.classList.add('hidden');
  seenAdmin = messages.filter(m => m.from === 'admin').length;
  setUnread(0);
  render();
  connect().catch(e => console.error('Weblume chat:', e));
  if (matchMedia('(hover:hover)').matches) {
    setTimeout(() => (box.classList.contains('named') ? msgIn : nameIn).focus({ preventScroll: true }), 300);
  }
}
function close() {
  isOpen = false;
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('wlc-lock');
  lb.classList.remove('show');
  if (fab) fab.classList.remove('hidden');
}

$('.wlc-x').addEventListener('click', close);
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || !isOpen) return;
  if (lb.classList.contains('show')) lb.classList.remove('show'); else close();
});

nameForm.addEventListener('submit', e => {
  e.preventDefault();
  const n = nameIn.value.trim();
  if (!n) { nameForm.classList.add('bad'); return; }
  store.set(NAME_KEY, n);
  box.classList.add('named');
  if (fb && fb.chatRef && store.get(STARTED_KEY)) fb.fsM.updateDoc(fb.chatRef, { name: n }).catch(() => {});
  msgIn.focus();
});
nameIn.addEventListener('input', () => nameForm.classList.remove('bad'));

cmp.addEventListener('submit', async e => {
  e.preventDefault();
  const v = msgIn.value;
  if (!v.trim()) return;
  if (LINK_RE.test(v) && !linksAllowed) { setNote(t('noLinks')); return; }
  msgIn.value = '';
  msgIn.style.height = '';
  send(v);
});
msgIn.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && matchMedia('(hover:hover)').matches) {
    e.preventDefault();
    cmp.requestSubmit();
  }
});
msgIn.addEventListener('input', () => {
  msgIn.style.height = 'auto';
  msgIn.style.height = Math.min(msgIn.scrollHeight, 140) + 'px';
});

if (fab) fab.addEventListener('click', open);

/* ---------- public API (used by the order form) ---------- */
window.WeblumeChat = {
  open,
  isReady: isConfigured,
  async sendRequest(text, name) {
    if (!isConfigured()) { window.open(FALLBACK, '_blank', 'noopener'); return; }
    if (name) { store.set(NAME_KEY, name); box.classList.add('named'); }
    open();
    await send(text.replace(new RegExp(LINK_RE.source, 'gi'), '[link]'));
  }
};

applyTexts();
if (fab) setTimeout(() => fab.classList.remove('hidden'), 1200);
// Returning visitors: reconnect quietly so replies show up as a badge on the button
if (isConfigured() && store.get(STARTED_KEY)) connect().catch(() => {});
