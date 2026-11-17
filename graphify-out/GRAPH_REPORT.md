# Graph Report - weblume-site  (2026-11-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 206 nodes · 274 edges · 15 communities (11 shown, 4 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `94c55aca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Live Chat Widget
- Cafe Demo Template
- Admin Chat Inbox
- Quran Companion Screenshot
- Admin Leads Tracker
- Order Form and Language
- Homepage Background and Work
- AskMyBook Screenshot
- TYT Cafe Screenshot
- TYT hero screenshot (tyt.webp)
- Main Logo Image
- Weblume Icon

## God Nodes (most connected - your core abstractions)
1. `leadCard()` - 10 edges
2. `Demo Page Renderer IIFE` - 9 edges
3. `Official Weblume logo (source file)` - 9 edges
4. `render()` - 8 edges
5. `Demo Page Renderer IIFE` - 8 edges
6. `TYT hero screenshot (tyt.webp)` - 8 edges
7. `send()` - 7 edges
8. `Quran Companion home screen hero image` - 7 edges
9. `Weblume Website` - 7 edges
10. `addForm new lead submit handler` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Weblume Website` --references--> `Site icon: W mark on black`  [EXTRACTED]
  index.html → assets/weblume-icon.png
- `Logo Intro (official logo reveal)` --references--> `Logo white parts only (W and WEB), for the intro`  [EXTRACTED]
  index.html → assets/logo-white.webp
- `Single-file index.html site` --conceptually_related_to--> `Weblume admin panel`  [AMBIGUOUS]
  README.md → admin/index.html
- `Red Arrow Rises Out of the W` --references--> `Logo red parts only (arrow and LUME), for the intro`  [EXTRACTED]
  index.html → assets/logo-red.webp
- `LUME Soft Mask Wipe` --references--> `Logo red parts only (arrow and LUME), for the intro`  [EXTRACTED]
  index.html → assets/logo-red.webp

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lead intake deduplication** — admin_index_addform_submit_handler, admin_index_import_handler, admin_index_normphone, admin_index_ighandle, admin_index_finddup [EXTRACTED 1.00]
- **Lead outreach and status tracking flow** — admin_index_leadcard, admin_index_sendwa, admin_index_sendig, admin_index_marksent, admin_index_setstatus, admin_index_firestore_leads [EXTRACTED 1.00]
- **Logo intro sequence** — index_intro_stage, index_intro_arrow_rise, index_intro_lume_wipe, index_intro_flight [EXTRACTED 1.00]
- **AskMyBook study flow: add books, scope, quick prompts, page actions** — assets_hero_book_add_pdf_button, assets_hero_book_book_scope_selector, assets_hero_book_quick_actions, assets_hero_book_page_actions [INFERRED 0.75]
- **Hero call-to-action group: headline, start button, continue button** — assets_hero_quran_hero_heading, assets_hero_quran_start_button, assets_hero_quran_continue_button [INFERRED 0.75]
- **Admin chat reply flow** — admin_index_openchat, admin_index_rendermsgs, admin_index_sendadmin, admin_index_firestore_chats [INFERRED 0.85]
- **TYT hero brand identity (mascot, wordmark, tagline)** — assets_hero_tyt_logo_mascot, assets_hero_tyt_wordmark, assets_hero_tyt_tagline [INFERRED 0.85]
- **Config-Driven Client Demo Generation** — demo_readme_client_demo_workflow, demo_readme_data_js_config, demo__template_index_cafe_config, demo__template_index_page_renderer, demo_la_casa_de_pan_index_page_renderer [INFERRED 0.95]

## Communities (15 total, 4 thin omitted)

### Community 0 - "Live Chat Widget"
Cohesion: 0.08
Nodes (37): alertPhone(), applyTexts(), body, box, bubble(), cmp, compress(), connect() (+29 more)

### Community 1 - "Cafe Demo Template"
Cohesion: 0.10
Nodes (23): Brand Color Contrast Check, window.CAFE Config, Menu Category Chips Scroll Spy, dayRange(), Demo Preview Ribbon, fmt(), mins(), Robots Noindex Meta Tag (+15 more)

### Community 2 - "Admin Chat Inbox"
Cohesion: 0.13
Nodes (17): compress(), fileIn image attach handler, Firestore chats collection, Firestore meta/status document, initial(), linkBtn per-chat links toggle, logoutBtn click handler, notify() (+9 more)

### Community 3 - "Quran Companion Screenshot"
Cohesion: 0.11
Nodes (17): Quran Companion home screen hero image, Brand logo and app name (رفيق القرآن), Secondary CTA button: أكمل من حيث توقفت (Continue where you stopped), Today's review card: مراجعة اليوم (Today's review), Daily review habit (مراجعة), Gold small tagline: your daily memorization companion (رفيقك اليومي في الحفظ), Header controls: account icon, theme toggle, EN language switch, Hero headline: ابدأ رحلتك مع القرآن (Start your Quran journey) (+9 more)

### Community 4 - "Admin Leads Tracker"
Cohesion: 0.14
Nodes (18): Logo red parts only (arrow and LUME), for the intro, Logo white parts only (W and WEB), for the intro, Site icon: W mark on black, Weblume logo, transparent, full size, Official Weblume logo (source file), Black, white and red brand palette, White W mark with red upward arrow, WEBLUME wordmark (WEB white, LUME red) (+10 more)

### Community 5 - "Order Form and Language"
Cohesion: 0.25
Nodes (17): addForm new lead submit handler, copy(), findDup(), Firestore leads collection, igHandle(), importBtn bulk lead import handler, isDue(), leadCard() (+9 more)

### Community 6 - "Homepage Background and Work"
Cohesion: 0.16
Nodes (14): AskMyBook Project, Drifting Web Icons Canvas Background, checkSpeed(), frame(), Gallery Arrows, Dots and Swipe, Hero Project Gallery (auto flip + manual controls), Image Save Guard (no right-click / drag), makeMark() (+6 more)

### Community 7 - "AskMyBook Screenshot"
Cohesion: 0.16
Nodes (13): applyLang(), closeAll(), closeSel(), Custom Select Listbox Widget, Instagram DM Fallback (ig.me/m/weblume1), Order Form (#orderForm), Order Form Submit Handler, renderSelect() (+5 more)

### Community 8 - "TYT Cafe Screenshot"
Cohesion: 0.20
Nodes (10): AskMyBook app hero screenshot (book.webp), Add books (PDF) button, AskMyBook app (AI study tutor for uploaded books), Book scope selector (all books), Empty library state (no books uploaded yet), Page actions (explain lesson, solve page), Quick study prompts (explain lesson, summarize chapter, quiz me, flashcards, key points before exam), Reading panel (الكراسة) with PDF page viewer (+2 more)

### Community 9 - "TYT hero screenshot (tyt.webp)"
Cohesion: 0.29
Nodes (10): TYT hero screenshot (tyt.webp), Get Directions secondary button (outline), Arabic / EN language toggle, TYT bear mascot logo (cap, sunglasses, coffee cup), TYT top navigation bar (Home, About, Menu, Offers, Gallery, Comments, Location, Contact), Coffee & Lounge - 10th of Ramadan badge, Take Your Time tagline (purple italic), Unique Coffee / Unmatched Vibes value props (+2 more)

### Community 10 - "Main Logo Image"
Cohesion: 0.25
Nodes (6): Weblume admin panel, onAuthStateChanged admin gate, stop(), GitHub Pages hosting, Single-file index.html site, Weblume

## Ambiguous Edges - Review These
- `Weblume admin panel` → `Single-file index.html site`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to

## Knowledge Gaps
- **37 isolated node(s):** `Chat Floating Button (#chatFab)`, `Brand Color Contrast Check`, `Menu Category Chips Scroll Spy`, `Robots Noindex Meta Tag`, `Menu Category Chips Scroll Spy` (+32 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 74 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Weblume Website` connect `Admin Leads Tracker` to `Cafe Demo Template`, `Homepage Background and Work`, `AskMyBook Screenshot`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Demo Page Renderer IIFE` (e.g. with `Demo Page Renderer IIFE` and `_template Folder`) actually correct?**
  _`Demo Page Renderer IIFE` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Chat Floating Button (#chatFab)`, `Brand Color Contrast Check`, `Menu Category Chips Scroll Spy` to the rest of the system?**
  _37 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Live Chat Widget` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Why does `Order Form (#orderForm)` connect `AskMyBook Screenshot` to `Admin Leads Tracker`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Demo Page Renderer IIFE` (e.g. with `Demo Page Renderer IIFE` and `Client Demo Workflow`) actually correct?**
  _`Demo Page Renderer IIFE` has 2 INFERRED edges - model-reasoned connections that need verification._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Weblume admin panel` and `Single-file index.html site`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._