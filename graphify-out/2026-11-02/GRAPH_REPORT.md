# Graph Report - weblume-site  (2026-11-02)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 232 nodes · 306 edges · 18 communities (14 shown, 4 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07759957`
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
- Loopie Cafe Page
- Main Logo Image
- Small Logo Image
- OG Share Image
- Weblume Icon

## God Nodes (most connected - your core abstractions)
1. `Loopie Cafe Page` - 11 edges
2. `leadCard()` - 10 edges
3. `Demo Page Renderer IIFE` - 9 edges
4. `render()` - 8 edges
5. `Demo Page Renderer IIFE` - 8 edges
6. `TYT hero screenshot (tyt.webp)` - 8 edges
7. `send()` - 7 edges
8. `Quran Companion home screen hero image` - 7 edges
9. `addForm new lead submit handler` - 7 edges
10. `openChat()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Single-file index.html site` --conceptually_related_to--> `Weblume admin panel`  [AMBIGUOUS]
  README.md → admin/index.html
- `Demo Preview Ribbon` --references--> `Weblume Website`  [EXTRACTED]
  demo/_template/index.html → index.html
- `Arabic and English Switch` --references--> `window.CAFE (Loopie)`  [EXTRACTED]
  demo/loopie-cafe/index.html → demo/loopie-cafe/data.js
- `Demo Page Renderer IIFE` --semantically_similar_to--> `Demo Page Renderer IIFE`  [INFERRED] [semantically similar]
  demo/la-casa-de-pan/index.html → demo/_template/index.html
- `_template Folder` --references--> `Demo Page Renderer IIFE`  [INFERRED]
  demo/README.md → demo/_template/index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Adaptive Background Animation Loop** — index_frame, index_checkspeed, index_resize, index_stopanimation, index_makemark [EXTRACTED 1.00]
- **Lead intake deduplication** — admin_index_addform_submit_handler, admin_index_import_handler, admin_index_normphone, admin_index_ighandle, admin_index_finddup [EXTRACTED 1.00]
- **Lead outreach and status tracking flow** — admin_index_leadcard, admin_index_sendwa, admin_index_sendig, admin_index_marksent, admin_index_setstatus, admin_index_firestore_leads [EXTRACTED 1.00]
- **Order Request to Live Chat Flow** — index_order_form, index_order_form_submit, index_sendrequest, index_weblumechat_bridge, index_instagram_dm_fallback [EXTRACTED 1.00]
- **Weblume logo composition (W mark, wordmark, tagline)** — assets_weblume_logo_sm_w_mark, assets_weblume_logo_sm_wordmark, assets_weblume_logo_sm_tagline [EXTRACTED 1.00]
- **AskMyBook study flow: add books, scope, quick prompts, page actions** — assets_hero_book_add_pdf_button, assets_hero_book_book_scope_selector, assets_hero_book_quick_actions, assets_hero_book_page_actions [INFERRED 0.75]
- **Hero call-to-action group: headline, start button, continue button** — assets_hero_quran_hero_heading, assets_hero_quran_start_button, assets_hero_quran_continue_button [INFERRED 0.75]
- **Weblume icon composition** — assets_weblume_icon_w_monogram, assets_weblume_icon_code_window_icon, assets_weblume_icon_brand_palette [INFERRED 0.75]
- **Admin chat reply flow** — admin_index_openchat, admin_index_rendermsgs, admin_index_sendadmin, admin_index_firestore_chats [INFERRED 0.85]
- **TYT hero brand identity (mascot, wordmark, tagline)** — assets_hero_tyt_logo_mascot, assets_hero_tyt_wordmark, assets_hero_tyt_tagline [INFERRED 0.85]
- **Config-Driven Client Demo Generation** — demo_readme_client_demo_workflow, demo_readme_data_js_config, demo__template_index_cafe_config, demo__template_index_page_renderer, demo_la_casa_de_pan_index_page_renderer [INFERRED 0.95]

## Communities (18 total, 4 thin omitted)

### Community 0 - "Live Chat Widget"
Cohesion: 0.08
Nodes (37): alertPhone(), applyTexts(), body, box, bubble(), cmp, compress(), connect() (+29 more)

### Community 1 - "Cafe Demo Template"
Cohesion: 0.10
Nodes (23): Brand Color Contrast Check, window.CAFE Config, Menu Category Chips Scroll Spy, dayRange(), Demo Preview Ribbon, fmt(), mins(), Robots Noindex Meta Tag (+15 more)

### Community 2 - "Admin Chat Inbox"
Cohesion: 0.08
Nodes (23): Weblume admin panel, compress(), fileIn image attach handler, Firestore chats collection, Firestore meta/status document, initial(), linkBtn per-chat links toggle, logoutBtn click handler (+15 more)

### Community 3 - "Quran Companion Screenshot"
Cohesion: 0.11
Nodes (17): Quran Companion home screen hero image, Brand logo and app name (رفيق القرآن), Secondary CTA button: أكمل من حيث توقفت (Continue where you stopped), Today's review card: مراجعة اليوم (Today's review), Daily review habit (مراجعة), Gold small tagline: your daily memorization companion (رفيقك اليومي في الحفظ), Header controls: account icon, theme toggle, EN language switch, Hero headline: ابدأ رحلتك مع القرآن (Start your Quran journey) (+9 more)

### Community 4 - "Admin Leads Tracker"
Cohesion: 0.25
Nodes (17): addForm new lead submit handler, copy(), findDup(), Firestore leads collection, igHandle(), importBtn bulk lead import handler, isDue(), leadCard() (+9 more)

### Community 5 - "Order Form and Language"
Cohesion: 0.15
Nodes (15): applyLang(), closeAll(), closeSel(), Custom Select Listbox Widget, Instagram DM Fallback (ig.me/m/weblume1), Order Form (#orderForm), Order Form Submit Handler, Four-Step Process (Talk, Design, Build, Launch) (+7 more)

### Community 6 - "Homepage Background and Work"
Cohesion: 0.19
Nodes (12): AskMyBook Project, Drifting Web Icons Canvas Background, checkSpeed(), frame(), Hero Project Windows Fan Animation, makeMark(), Portfolio Work Section (#work), Quran Companion Project (+4 more)

### Community 7 - "AskMyBook Screenshot"
Cohesion: 0.20
Nodes (10): AskMyBook app hero screenshot (book.webp), Add books (PDF) button, AskMyBook app (AI study tutor for uploaded books), Book scope selector (all books), Empty library state (no books uploaded yet), Page actions (explain lesson, solve page), Quick study prompts (explain lesson, summarize chapter, quiz me, flashcards, key points before exam), Reading panel (الكراسة) with PDF page viewer (+2 more)

### Community 8 - "TYT Cafe Screenshot"
Cohesion: 0.29
Nodes (10): TYT hero screenshot (tyt.webp), Get Directions secondary button (outline), Arabic / EN language toggle, TYT bear mascot logo (cap, sunglasses, coffee cup), TYT top navigation bar (Home, About, Menu, Offers, Gallery, Comments, Location, Contact), Coffee & Lounge - 10th of Ramadan badge, Take Your Time tagline (purple italic), Unique Coffee / Unmatched Vibes value props (+2 more)

### Community 9 - "Loopie Cafe Page"
Cohesion: 0.11
Nodes (18): brew(), window.CAFE (Loopie), Drinks Data, drinks(), Missing Image Fallback, fmt(), frame(), Sideways Place Gallery (+10 more)

### Community 10 - "Main Logo Image"
Cohesion: 0.47
Nodes (5): Weblume logo, Glowing red orbit ring, Websites that make an impact tagline, White and red W mark, Weblume wordmark (white Web, red lume)

### Community 11 - "Small Logo Image"
Cohesion: 0.70
Nodes (5): Weblume logo (small WebP), Weblume black, red, white brand palette, Websites that make an impact tagline, Red and white W mark with red orbit ring, Weblume wordmark (Web white, lume red)

### Community 12 - "OG Share Image"
Cohesion: 0.50
Nodes (5): Weblume brand palette (black, red, white), Websites that make an impact tagline, White and red W mark with glowing red orbit ring, Weblume logo (OG image), Weblume wordmark (Web in white, lume in red)

### Community 13 - "Weblume Icon"
Cohesion: 0.83
Nodes (4): Weblume icon, Weblume brand palette (black, red, white), Browser window with code brackets icon, Weblume W monogram

## Ambiguous Edges - Review These
- `Weblume admin panel` → `Single-file index.html site`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to

## Knowledge Gaps
- **35 isolated node(s):** `Chat Floating Button (#chatFab)`, `Brand Color Contrast Check`, `Menu Category Chips Scroll Spy`, `Robots Noindex Meta Tag`, `Menu Category Chips Scroll Spy` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 79 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Weblume Website` connect `Order Form and Language` to `Cafe Demo Template`, `Homepage Background and Work`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Demo Page Renderer IIFE` (e.g. with `Demo Page Renderer IIFE` and `_template Folder`) actually correct?**
  _`Demo Page Renderer IIFE` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Chat Floating Button (#chatFab)`, `Brand Color Contrast Check`, `Menu Category Chips Scroll Spy` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Live Chat Widget` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Are the 2 inferred relationships involving `Demo Page Renderer IIFE` (e.g. with `Demo Page Renderer IIFE` and `Client Demo Workflow`) actually correct?**
  _`Demo Page Renderer IIFE` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Cafe Demo Template` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Weblume admin panel` and `Single-file index.html site`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._