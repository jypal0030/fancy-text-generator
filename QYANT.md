# fancy-text-generator

## What we are building

Imported from jypal0030/fancy-text-generator

FontVerse is a public Unicode text generator with live previews, style filters, copy buttons, and favorites.

## Stack

Static HTML, CSS, and vanilla JavaScript. The generator and its base styles live in the root `index.html`. Specialized tools share `text-tools.css` and `text-tools.js`. The homepage navigation is written in `index.html` and uses `site-nav.css` and `site-nav.js` for its responsive menu.

## Data model

Style definitions are bundled in the browser script. Favorites are stored on the device. The generator does not use a server-side data model.

## Pages and routes

- `/` — generator and reference content, including a featured Type Studio link in the intro, the `#generator` section and the `#text-tools` directory immediately after it.
- `/bubble-text-generator/` — outlined and filled Unicode bubble letters.
- `/cursive-text-generator/` — regular and bold Unicode script previews.
- `/instagram-bio-fonts/` — bold, italic and fullwidth previews with editable bio examples.
- `/brackets-boxed-text-generator/` — live previews and copy controls for decorative brackets and outlined or filled square letters.
- `/case-converter/` — nine live case previews with individual copy buttons, plus a dropdown for extra conversions and text cleanup; uses `utility-tools.js`.
- `/cute-fancy-text/` — live previews and copy controls for hearts, stars, bows and floral cursive.
- `/kaomoji/` — searchable Japanese emoticons and Lenny faces with copy buttons; uses `utility-tools.js` and is linked from the homepage and sitemap.
- `/gothic-font-generator/` — five live previews with copy controls: regular and bold Fraktur plus three decorative frames.
- `/bold-font-generator/` — five live previews with copy controls: bold serif and sans serif, italic variants of both, and underlined bold sans serif.
- `/type-studio/` — separate typography workspace with a live system Font Tester, linked from the homepage header, intro and Text Tools directory.
- `/type-studio/transparent-text-generator/` — browser-rendered transparent PNG export with font, size, colour and padding controls.
- `/type-studio/fancy-letters/` — five copyable Unicode styles for each uppercase letter A–Z.
- `/symbols/` — copyable Unicode symbol hub, linked from the homepage Text Tools directory.
- `/flower-symbols/`, `/maths-symbols/`, and `/discord-symbols/` — static copyable symbol collections linked from the hub and listed in the sitemap.
- `robots.txt`, `sitemap.xml`, and `og-image.svg` are static crawl and sharing assets.

## Environment

The static page does not require runtime environment variables. The optional GitHub Actions Hostinger FTP deployment uses the `FTP_DEPLOY_ENABLED` repository variable and the `FTP_SERVER`, `FTP_USERNAME`, and `FTP_PASSWORD` repository secrets.

## Decisions

The results grid retains a 290px minimum per column when space permits and allows a narrower single column on small screens.

On phones and tablets, the homepage keeps a compact standalone Type Studio card, with the navbar link only inside the toggle menu. Type Studio pages inherit the homepage theme using browser storage, or the device preference if no homepage theme has been saved.

Type Studio keeps Back and the three tool tabs on one row from 40rem upward. Below that, Back has its own row and the three tool tabs form a separate row with 44px minimum targets.

Canonical URLs use `https://fancyfonty.com/`, matching the sitemap. The homepage covers broad fancy-text queries; separate pages target distinct tools, not keyword variants. Seasonal pages and additional utility pages are future candidates.

All 12 tool pages list the same 12 tools in static HTML, with descriptions and an `aria-current="page"` link for the current tool. The homepage lists the same 12 tool destinations separately from its own current-page label.

## Change log

- Memory file added to an existing project; pending reconstruction.
- Reconstructed project memory and made the results grid minimum responsive.
- Added Bubble Text, Cursive Text and Instagram Bio Fonts tools and aligned homepage metadata with the sitemap domain.
- Added the Brackets and Boxed Text Generator and linked it from the homepage and sitemap.
- Expanded the Case Converter with side-by-side copyable previews, updated its SEO title, and linked it from the homepage and sitemap.
- Added Cute Fancy Text, linked it from the homepage and sitemap, and positioned the homepage tool directory before the footer.
- Linked Kaomoji from the homepage and sitemap, updated its title, and added practical examples and contextual links to tool pages.
- Switched canonical URLs, homepage sharing metadata and structured data, robots.txt, and sitemap URLs to `fancyfonty.com`.
- Moved the homepage tool directory directly below the generator in HTML and removed its JavaScript relocation.
- Added Gothic and Bold Font Generators, linked them from the homepage directory and related tools, and added both to the sitemap.
- Expanded Gothic and Bold to five previews each and added a Back to Text Tools link to the homepage directory on both pages.
- Added the three-page Type Studio workspace and listed its canonical URLs in the sitemap.
- Linked Type Studio from the homepage Text Tools directory in static HTML.
- Linked Type Studio from the homepage Text Tools directory in static HTML.
- Linked Type Studio from the homepage Text Tools directory.
- Featured Type Studio directly below the homepage intro with a static link to the Font Tester.
- Featured Type Studio directly below the homepage intro with a static link to the Font Tester.
- Featured Type Studio in the homepage intro so it can be found without scrolling to the directory.
- Replaced the homepage navbar with a type-specimen wordmark, a prominent Type Studio link, an Explore disclosure, and a mobile menu while preserving the theme control.
- Kept a compact Type Studio shortcut visible outside the collapsed menu on phones and tablets.
- Kept the Type Studio shortcut visible outside the collapsed homepage menu on phones and tablets.
- Removed the pinned mobile header shortcut; Type Studio remains in the toggle menu and in the homepage intro as a compact card with a visible Font Tester action.
- Removed the pinned mobile header shortcut; Type Studio remains in the toggle menu and in the homepage intro as a compact card with a visible Font Tester action.
- Restored Type Studio to the mobile menu and kept the compact, labeled Type Studio card in the homepage intro.
- Refined the shared Type Studio navigation and responsive specimen layouts, and updated all three pages with distinct metadata and contextual links to related tools.
- Kept the homepage Type Studio card compact on phones and tablets without changing the navbar; all three Studio pages use the homepage's `ffg_theme` preference or fall back to the device theme.
- Kept the standalone homepage Type Studio card compact on phones and tablets without changing the navbar; all three Studio pages inherit the homepage's `ffg_theme` preference or use the device preference.
- Kept the homepage Type Studio card compact and tappable on small screens and shared the homepage theme across all three Studio pages.
- Made Studio navigation and specimen cards more compact on phones and removed duplicate dark-theme rules.
- Added page-specific WebApplication JSON-LD to all 11 tool pages using their sitemap canonical URLs.
- Added the static FontVerse tool directory to all three Type Studio pages with responsive fern-green cards and a current-page label on Font Tester.
- Added the static homepage directory with 12 standalone tool links, descriptions, fern-green styling and a separate current-page label for the homepage.
- Completed the static 12-tool directories on all three Type Studio pages and marked each page’s own entry as current.
- Replaced the JavaScript-rendered directories on the nine standalone pages with static 12-tool lists and current-page markers, leaving SEO metadata unchanged.
- Added Flower, Maths, and Discord Symbols collections and linked the Cool Symbols hub from the homepage.
- Refined the Cool Symbols hub and six collections on their existing canonical URLs; the three cross copy-and-paste query variants share `/cross-symbols/`.
- Added matching breadcrumb JSON-LD across the symbol library, grouped flower and maths characters, and added copyable Discord and flower examples without changing URLs.
- Added copyable Instagram, Discord, and WhatsApp examples and a visible FAQ to the existing Cross Symbols page.
- Updated the Flower Symbols search metadata and added copyable Instagram, Discord, and WhatsApp examples and a visible FAQ at the existing URL.