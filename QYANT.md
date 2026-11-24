# fancy-text-generator

## What we are building

Imported from jypal0030/fancy-text-generator

FontVerse is a public Unicode text generator with live previews, style filters, copy buttons, and favorites.

## Stack

Static HTML, CSS, and vanilla JavaScript. The generator and its base styles live in the root `index.html`. Specialized tools share `text-tools.css` and `text-tools.js`.

## Data model

Style definitions are bundled in the browser script. Favorites are stored on the device. The generator does not use a server-side data model.

## Pages and routes

- `/` — generator and reference content, including the `#generator` section and links to specialized tools.
- `/bubble-text-generator/` — outlined and filled Unicode bubble letters.
- `/cursive-text-generator/` — regular and bold Unicode script previews.
- `/instagram-bio-fonts/` — bold, italic and fullwidth previews with editable bio examples.
- `/brackets-boxed-text-generator/` — live previews and copy controls for decorative brackets and outlined or filled square letters.
- `robots.txt`, `sitemap.xml`, and `og-image.svg` are static crawl and sharing assets.

## Environment

The static page does not require runtime environment variables. The optional GitHub Actions Hostinger FTP deployment uses the `FTP_DEPLOY_ENABLED` repository variable and the `FTP_SERVER`, `FTP_USERNAME`, and `FTP_PASSWORD` repository secrets.

## Decisions

The results grid retains a 290px minimum per column when space permits and allows a narrower single column on small screens.

Canonical URLs use `https://fancyfontly.com/`, matching the sitemap. The homepage covers broad fancy-text queries; separate pages target distinct tools, not keyword variants. Seasonal, kaomoji and utility pages are future candidates.

## Change log

- Memory file added to an existing project; pending reconstruction.
- Reconstructed project memory and made the results grid minimum responsive.
- Added Bubble Text, Cursive Text and Instagram Bio Fonts tools and aligned homepage metadata with the sitemap domain.
- Added the Brackets and Boxed Text Generator and linked it from the homepage and sitemap.