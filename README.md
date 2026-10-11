# ميزان النبوة — The Scale of Prophethood

An Arabic-only static learning website exploring John Maxwell’s 21 leadership laws through editorial reflections grounded in the Qur’an and authentic Sunnah.

## Technology and cost

Plain HTML, CSS, and JavaScript, matching the frontend technology used by ProjectCanvas and al-qayoom-canvas. No backend, database, serverless functions, paid APIs, analytics, accounts, or subscriptions. Arabic fonts load from Google Fonts, with local system fallbacks. Hosting is Cloudflare Pages; no paid plan or custom domain is needed.

## Local preview

Run `python3 -m http.server 8000` from this directory, then visit `http://localhost:8000`.

## Content

Edit `js/content.js` for the 21 laws, reflections, exercises, and references. The compass has four clickable poles. Selecting a path displays its laws in the details panel beneath it; each law opens to reveal the comparison, reference, and exercise. The initial panel remains empty with a selection prompt. Four paths preserve the supplied concept and grouping. The first five names and numbering were corrected against Maxwell’s official 25th anniversary workbook list; priorities remains law 17. Arabic names are descriptive translations, and summaries are original brief paraphrases. Islamic reflections are editorial applications, not quotations, fatwas, or claims of Prophetic endorsement of Maxwell’s framework. Scripture excerpts are labelled and linked to their sources.

Original user material remains in `sources_only/`. Cloudflare deployments upload only `index.html`, `css/`, `js/`, and `assets/`; it excludes source references and documentation from the website artifact.

## Publishing

Public site: https://mizan-al-nubuwwa.pages.dev/

Cloudflare Pages is the only website host. GitHub stores the source code; GitHub Pages hosting is disabled. All URLs are relative. A law can be shared directly with `#law-1` through `#law-21`.

## Cloudflare Pages

The primary site is a free Cloudflare Pages Direct Upload project named `mizan-al-nubuwwa`. It contains only `index.html`, `css/`, `js/`, and `assets/`. No Functions, Workers compute, database, or paid plan was enabled. Cloudflare deployments are separate from GitHub commits; future updates require uploading a fresh static archive through the project dashboard or configuring a deployment CLI.
