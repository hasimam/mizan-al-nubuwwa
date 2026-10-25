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

## Leadership Lab review preview

Each law now has an optional **جرّب موقفًا** disclosure after its original exercise. The 21 hypothetical situations and 63 choice-specific explanations live separately in `js/activities.js`. Learners can compare choices, open the existing reflection/source, and take a small practical next step. The new activities are editorial learning exercises, not accounts from the Sirah or validated assessments. They add no religious quotations or claims of scholarly review.

Choices stay in memory while navigating the app and disappear on reload. There are no scores, accounts, tracking, or persistent results. Removing the `js/activities.js` script tag disables the activities; the original content continues to render.

### One pre-change backup

`parked/mizan-before-leadership-lab.tar.gz` contains the working files as they were before this update, including pre-existing local edits. All 10 archived files were extracted into a temporary directory and compared byte for byte with the originals before implementation. `js/content.js` remains identical to the archived version (SHA-256 `026d515ffffc4786cc78d352562e7771d1beba00b3b3e606b67d7009ea794bb9`). Keep this archive local; it is not part of the deployment artifact.

To restore the previous application from the project directory:

```sh
tar -xzf parked/mizan-before-leadership-lab.tar.gz index.html css/styles.css js/app.js js/content.js
```

The extra activity file is then unused. Preview the restored files before uploading. Publishing a rollback requires uploading the restored static artifact to Cloudflare Pages. As before, upload only `index.html`, `css/`, `js/`, and `assets/`; exclude parked backups, tests, screenshots, and source reference material.

### Browser verification

With a local server on port 8765 and Playwright available, run `node tests/activities.cjs`. Set `PLAYWRIGHT_MODULE` to an absolute Playwright module path if using a bundled installation. The test uses installed Google Chrome and covers every choice, preservation of displayed original text, deep links, disclosures, retries, keyboard controls, temporary state, and layouts at widths of 320, 390, 768, and 1280 pixels. Screenshots are saved under ignored `test-results/`. `MIZAN_TEST_URL` overrides the local URL.
