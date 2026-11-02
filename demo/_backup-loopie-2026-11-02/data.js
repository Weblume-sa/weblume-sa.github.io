// shortcut: assets/img/{v60,bar,corner,cups,lounge,brownie} come from the cafe's Google Maps listing (some are customer uploads), replace with the cafe's own files before delivery
// assets/brew-* : Pexels videos 30690821, 7487683, 6769788 and Mixkit 41859. beans-*: Mixkit 4982. pour-*: Mixkit 796
// assets/img/drink-* and menu-* : Pexels photos 6747870, 18142624, 33526960, 4913342, 8004561
window.CAFE = {
  name: "قهوة لوباي",
  word: "لوباي",
  nameEn: "LOOPIE CAFE",
  tagline: "نختلف عالجو.. ونتفق عالقهوة",
  rating: { value: "4.8", count: 171 },
  hours: "24h",
  whatsapp: "966590595914",
  phone: "+966549663063",
  phoneText: "054 966 3063",
  instagram: "loopiecafe",
  tiktok: "loopiecafe",
  mapsQuery: "Loopiecafe, Khaleej Rd, Al Muntazah, Saihat",
  address: "طريق الخليج، حي المنتزه، سيهات 32452",
  about: "نجمع هنا أصحاب الذائقة الرفيعة من عشاق القهوة.",
  hashtag: "#لوباي_يجمعنا",
  invite: "نورنا بقهوتك.",

  /* s scales the drink */
  drinks: [
    { name: "لاتيه", desc: "إسبريسو وحليب مبخّر", img: "assets/img/drink-capp.webp", ratio: "1070/1000", s: .8, bg: "#B5502F", fg: "#FFF6EC" },
    { name: "ماتشا", desc: "من أكثر ما يذكره زوارنا", img: "assets/img/drink-green.webp", ratio: "630/1060", s: 1, bg: "#2F4420", fg: "#F4F6E6" },
    { name: "آيس لاتيه", desc: "لاتيه بارد بطبقات", img: "assets/img/drink-tall.webp", ratio: "440/1120", s: 1.16, bg: "#EBB81F", fg: "#141210" }
  ],

  menuNote: "الأصناف والأسعار تتحدث من منيو المحل",
  menu: [
    { name: "القهوة", img: "assets/img/menu-coffee.webp", alt: "لاتيه برسمة على الوجه", items: [
      { name: "V60", desc: "محاصيل إثيوبيا وكوستاريكا وكولومبيا" },
      { name: "أمريكانو", desc: "ناعم وبدون حموضة" },
      { name: "لاتيه" },
      { name: "إسبريسو" }
    ]},
    { name: "غير القهوة", img: "assets/img/menu-matcha.webp", alt: "ماتشا بارد مع مضرب الخيزران", items: [
      { name: "ماتشا" },
      { name: "كركديه" }
    ]},
    { name: "الحلى", img: "assets/img/brownie.webp", alt: "براونيز ولاتيه على طاولة في لوباي", items: [
      { name: "براونيز", desc: "يُحضّر عندنا" },
      { name: "تشيز كيك", desc: "نكهات مبتكرة تُحضّر عندنا" },
      { name: "تيراميسو" },
      { name: "وافل" }
    ]}
  ],

  /* the real place, shown no larger than the photos' own size */
  place: [
    { src: "assets/img/v60.webp", alt: "باريستا يحضّر قهوة V60 ويلبس تيشيرت لوباي", w: 854, h: 1280 },
    { src: "assets/img/bar.webp", alt: "البار وآلات القهوة", w: 3, h: 4 },
    { src: "assets/img/corner.webp", alt: "ركن فيه لوحة سيهات وكرسيين", w: 1107, h: 1259 },
    { src: "assets/img/lounge.webp", alt: "الجلسة في الدور الثاني", w: 1280, h: 854 },
    { src: "assets/img/cups.webp", alt: "طاولة عليها أكواب لوباي وورد أصفر", w: 9, h: 16 }
  ],
  demo: true
};
