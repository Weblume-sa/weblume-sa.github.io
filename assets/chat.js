// Weblume live chat widget (visitor side). Messages are stored in Firestore:
//   chats/{visitorUid}            -> name, lastMessage, updatedAt, unreadAdmin, unreadVisitor
//   chats/{visitorUid}/messages   -> from: 'visitor' | 'admin', text, at
//   meta/status                   -> online, at   (written by the admin page)
import { firebaseConfig, FIREBASE_SDK, isConfigured } from './firebase-config.js?v=3';

const FALLBACK = 'https://ig.me/m/weblume1';
// Phone alerts via the ntfy app (subscribe to this topic in the app)
const NTFY_TOPIC = 'weblume-chat-k7q2x9m4';
const ADMIN_URL = 'https://weblume-sa.github.io/admin/';

function alertPhone(text) {
  try {
    fetch('https://ntfy.sh/', {
      method: 'POST',
      body: JSON.stringify({
        topic: NTFY_TOPIC,
        title: 'رسالة جديدة من ' + (store.get(NAME_KEY) || 'زائر'),
        message: text.slice(0, 300),
        tags: ['speech_balloon'],
        priority: 4,
        click: ADMIN_URL
      }),
      keepalive: true
    }).catch(() => {});
  } catch (e) {}
}
const NAME_KEY = 'wl-chat-name';
const STARTED_KEY = 'wl-chat-started';

const T = {
  ar: {
    title: 'Weblume', online: 'أونلاين دلوقتي', away: 'هنرد عليك في أقرب وقت',
    hello: 'أهلاً بيك في Weblume! محتاج موقع لإيه؟ اكتبلنا وهنرد عليك هنا.',
    namePh: 'اسمك', start: 'ابدأ المحادثة', nameErr: 'اكتب اسمك عشان نعرف بنكلم مين',
    msgPh: 'اكتب رسالتك…', send: 'إرسال', close: 'إغلاق', sending: 'بيتبعت…',
    failed: 'الرسالة متبعتتش، دوس هنا وجرّب تاني', fab: 'كلمنا'
  },
  en: {
    title: 'Weblume', online: 'Online now', away: "We'll reply as soon as we can",
    hello: 'Welcome to Weblume! What kind of website do you need? Message us and we will reply right here.',
    namePh: 'Your name', start: 'Start chatting', nameErr: 'Add your name so we know who we are talking to',
    msgPh: 'Type your message…', send: 'Send', close: 'Close', sending: 'Sending…',
    failed: "Message wasn't sent, tap to retry", fab: 'Chat with us'
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
.wlc{position:fixed;bottom:88px;left:22px;z-index:70;width:370px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100dvh - 120px);display:flex;flex-direction:column;background:#0b0b0b;border:1px solid rgba(255,255,255,.12);border-radius:22px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.7),0 0 0 1px rgba(212,24,42,.15);font-family:var(--body,'IBM Plex Sans Arabic',sans-serif);color:#f7f5f2;opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .25s,transform .3s cubic-bezier(.2,.7,.2,1)}
html[dir="ltr"] .wlc{left:auto;right:22px}
.wlc.open{opacity:1;transform:none;pointer-events:auto}
.wlc-hd{display:flex;align-items:center;gap:12px;padding:16px 16px 14px;background:linear-gradient(180deg,rgba(212,24,42,.22),rgba(212,24,42,0));border-bottom:1px solid rgba(255,255,255,.08)}
.wlc-av{width:42px;height:42px;border-radius:50%;background:#000;border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex:none;position:relative}
.wlc-av img{width:30px;height:30px;object-fit:contain}
.wlc-av i{position:absolute;bottom:0;inset-inline-end:0;width:11px;height:11px;border-radius:50%;background:#6b6b6b;border:2px solid #0b0b0b}
.wlc.is-online .wlc-av i{background:#3ddc84}
.wlc-ttl{flex:1;min-width:0;line-height:1.35}
.wlc-ttl b{display:block;font-family:'Poppins',sans-serif;font-weight:700;font-size:17px;direction:ltr;text-align:start}
.wlc-ttl b span{color:#d4182a}
.wlc-ttl small{font-size:12.5px;color:#a7a39e}
.wlc-x{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#f7f5f2;cursor:pointer;display:flex;align-items:center;justify-content:center}
.wlc-x:hover{border-color:#d4182a}
.wlc-x svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round}
.wlc-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;overscroll-behavior:contain}
.wlc-m{max-width:82%;padding:9px 13px;border-radius:16px;font-size:14.5px;line-height:1.65;white-space:pre-wrap;word-wrap:break-word}
.wlc-m.wlc-them{align-self:flex-start;background:#1c1c1c;border:1px solid rgba(255,255,255,.07);border-start-start-radius:5px}
.wlc-m.wlc-me{align-self:flex-end;background:#d4182a;color:#fff;border-start-end-radius:5px}
.wlc-m.wlc-pend{opacity:.6}
.wlc-m.wlc-err{background:transparent;border:1px solid #d4182a;color:#ff8a94;cursor:pointer}
.wlc-time{font-size:11px;color:#77736f;align-self:center;margin:6px 0 2px}
.wlc-name{padding:14px 16px 16px;border-top:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:10px}
.wlc-name small{color:#ff8a94;font-size:12.5px;display:none}
.wlc-name.bad small{display:block}
.wlc-in{width:100%;background:#141414;border:1px solid rgba(255,255,255,.12);color:#f7f5f2;border-radius:14px;padding:12px 14px;font:inherit;font-size:15px;outline:none}
.wlc-in:focus{border-color:#d4182a}
.wlc-go{height:46px;border:0;border-radius:999px;background:#d4182a;color:#fff;font:inherit;font-weight:600;font-size:15px;cursor:pointer}
.wlc-go:hover{background:#ef2336}
.wlc-cmp{display:none;align-items:flex-end;gap:8px;padding:10px 12px 12px;border-top:1px solid rgba(255,255,255,.08)}
.wlc.named .wlc-cmp{display:flex}
.wlc.named .wlc-name{display:none}
.wlc-cmp textarea{flex:1;resize:none;max-height:120px;min-height:46px;line-height:1.5}
.wlc-snd{width:46px;height:46px;flex:none;border-radius:50%;border:0;background:#d4182a;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}
.wlc-snd:hover{background:#ef2336}
.wlc-snd svg{width:20px;height:20px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
html[dir="rtl"] .wlc-snd svg{transform:scaleX(-1)}
@media (max-width:520px){.wlc{left:8px;right:8px;width:auto;max-width:none;bottom:8px;height:calc(100dvh - 16px);max-height:none;border-radius:20px}html[dir="ltr"] .wlc{right:8px}}
`;
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

/* ---------- markup ---------- */
const box = document.createElement('div');
box.className = 'wlc';
box.setAttribute('role', 'dialog');
box.setAttribute('aria-hidden', 'true');
box.innerHTML = `
  <div class="wlc-hd">
    <div class="wlc-av"><img src="assets/weblume-icon.png" alt=""><i></i></div>
    <div class="wlc-ttl"><b>Web<span>lume</span></b><small data-k="away"></small></div>
    <button class="wlc-x" type="button" data-k-aria="close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </div>
  <div class="wlc-body" aria-live="polite"></div>
  <form class="wlc-name" novalidate>
    <input class="wlc-in" maxlength="60" autocomplete="name" data-k-ph="namePh">
    <small data-k="nameErr"></small>
    <button class="wlc-go" type="submit" data-k="start"></button>
  </form>
  <form class="wlc-cmp" novalidate>
    <textarea class="wlc-in" rows="1" maxlength="1500" data-k-ph="msgPh"></textarea>
    <button class="wlc-snd" type="submit" data-k-aria="send"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
  </form>`;
document.body.appendChild(box);

const $ = s => box.querySelector(s);
const body = $('.wlc-body'), nameForm = $('.wlc-name'), nameIn = $('.wlc-name input');
const cmp = $('.wlc-cmp'), msgIn = $('.wlc-cmp textarea'), statusEl = $('.wlc-ttl small');
const fab = document.getElementById('chatFab');
const fabCnt = document.getElementById('chatCnt');

function applyTexts() {
  box.querySelectorAll('[data-k]').forEach(el => { el.textContent = t(el.dataset.k); });
  box.querySelectorAll('[data-k-ph]').forEach(el => { el.placeholder = t(el.dataset.kPh); });
  box.querySelectorAll('[data-k-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.kAria)));
  statusEl.textContent = t(online ? 'online' : 'away');
  render();
}
new MutationObserver(applyTexts).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

/* ---------- state ---------- */
let fb = null;          // loaded Firebase modules + handles
let online = false;
let messages = [];      // from Firestore
let pending = [];       // optimistic, not yet confirmed
let isOpen = false;
let unread = 0;
let seenAdmin = -1;     // count of admin messages already seen

if (store.get(NAME_KEY)) { box.classList.add('named'); }

function fmtTime(ts) {
  const d = ts && ts.toDate ? ts.toDate() : new Date();
  return d.toLocaleTimeString(lang() === 'en' ? 'en-US' : 'ar-EG', { hour: 'numeric', minute: '2-digit' });
}
function bubble(text, cls) {
  const m = document.createElement('div');
  m.className = 'wlc-m ' + cls;
  m.textContent = text;
  return m;
}
function render() {
  const atBottom = body.scrollHeight - body.scrollTop - body.clientHeight < 60;
  body.textContent = '';
  body.appendChild(bubble(t('hello'), 'wlc-them'));
  let lastDay = '';
  messages.forEach(m => {
    const d = m.at && m.at.toDate ? m.at.toDate().toDateString() : '';
    if (d && d !== lastDay) {
      lastDay = d;
      const tm = document.createElement('div');
      tm.className = 'wlc-time';
      tm.textContent = m.at.toDate().toLocaleDateString(lang() === 'en' ? 'en-US' : 'ar-EG', { weekday: 'long', day: 'numeric', month: 'short' });
      body.appendChild(tm);
    }
    const b = bubble(m.text, m.from === 'admin' ? 'wlc-them' : 'wlc-me');
    b.title = fmtTime(m.at);
    body.appendChild(b);
  });
  pending.forEach(p => {
    const el = bubble(p.failed ? t('failed') + '\n' + p.text : p.text, 'wlc-me ' + (p.failed ? 'wlc-err' : 'wlc-pend'));
    if (p.failed) el.addEventListener('click', () => { pending = pending.filter(x => x !== p); send(p.text); });
    body.appendChild(el);
  });
  if (atBottom || isOpen) body.scrollTop = body.scrollHeight;
}

function setUnread(n) {
  unread = n;
  if (!fab) return;
  fabCnt.textContent = n > 9 ? '9+' : String(n);
  fab.classList.toggle('has-unread', n > 0);
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
    const cred = auth.currentUser ? { user: auth.currentUser } : await authM.signInAnonymously(auth);
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
  fsM.onSnapshot(fsM.query(fb.msgsRef, fsM.orderBy('at', 'asc')), snap => {
    messages = snap.docs.map(d => d.data());
    const admins = messages.filter(m => m.from === 'admin').length;
    if (seenAdmin < 0) seenAdmin = admins;
    if (isOpen) seenAdmin = admins;
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
  }, { merge: true });
  } catch (e) { /* chat already exists for this visitor */ }
  store.set(STARTED_KEY, '1');
  listen();
}

async function send(text) {
  text = String(text || '').trim().slice(0, 1500);
  if (!text) return;
  const p = { text };
  pending.push(p);
  render();
  try {
    await connect();
    await ensureChat();
    const { fsM } = fb;
    await fsM.addDoc(fb.msgsRef, { from: 'visitor', text, at: fsM.serverTimestamp() });
    await fsM.updateDoc(fb.chatRef, {
      updatedAt: fsM.serverTimestamp(),
      lastMessage: text.slice(0, 140),
      lastFrom: 'visitor',
      unreadAdmin: fsM.increment(1)
    });
    pending = pending.filter(x => x !== p);
    alertPhone(text);
  } catch (e) {
    p.failed = true;
    console.error('Weblume chat:', e);
  }
  render();
}

/* ---------- open / close ---------- */
function open() {
  if (!isConfigured()) { window.open(FALLBACK, '_blank', 'noopener'); return; }
  isOpen = true;
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
  if (fab) fab.classList.add('hidden');
  seenAdmin = messages.filter(m => m.from === 'admin').length;
  setUnread(0);
  render();
  connect().catch(e => console.error('Weblume chat:', e));
  setTimeout(() => (box.classList.contains('named') ? msgIn : nameIn).focus({ preventScroll: true }), 250);
}
function close() {
  isOpen = false;
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
  if (fab) fab.classList.remove('hidden');
}

$('.wlc-x').addEventListener('click', close);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });

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

cmp.addEventListener('submit', e => {
  e.preventDefault();
  const v = msgIn.value;
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
  msgIn.style.height = Math.min(msgIn.scrollHeight, 120) + 'px';
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
    await send(text);
  }
};

applyTexts();
if (fab) setTimeout(() => fab.classList.remove('hidden'), 1200);
// Returning visitors: reconnect quietly so replies show up as a badge on the button
if (isConfigured() && store.get(STARTED_KEY)) connect().catch(() => {});
