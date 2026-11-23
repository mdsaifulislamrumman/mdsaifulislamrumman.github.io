# MD. Saiful Islam Rumman — Portfolio Website

A static, responsive portfolio built with **HTML5, CSS3 and vanilla JavaScript (ES6+)**, with **Chart.js** for the project data view.
No build step, no backend — it runs on **GitHub Pages** as-is.

## Run locally

Browsers block `fetch()` on `file://` pages, so use a tiny local server (the JSON/CSV-driven parts need it):

```bash
cd my-portfolio
python -m http.server 8000      # then open http://localhost:8000
```

(or use the VS Code "Live Server" extension). On GitHub Pages this is not needed.

## Deploy to GitHub Pages

1. Create a repository (e.g. `my-portfolio`) and upload **the contents of this folder** (keep `index.html` at the repo root).
2. Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
3. After the site is live, **replace the placeholder URL** `https://YOUR-USERNAME.github.io/my-portfolio/` with your real site address in:
   `index.html`, every file in `pages/` (canonical + Open Graph tags), `robots.txt` and `sitemap.xml`.
   (Use your editor's "Find in files" → "Replace all".)

## Folder structure

```
my-portfolio/
├── index.html                  Home
├── pages/                      about · skills · experience · education · training · projects · credentials · contact
├── css/                        style.css (tokens + components) · responsive.css · animation.css
├── js/                         script.js (core) · projects.js · charts.js · credentials.js
├── assets/
│   ├── images/profile.png      ← your profile picture
│   ├── icons/                  favicon.svg · apple-touch-icon.png
│   └── documents/
│       ├── resume.pdf          ← your CV
│       └── credentials/        experience · appreciation · recommendation · employment-verification · professional-recognition · previews
├── data/                       projects.json · credentials.json   (content lives here)
└── projects/                   one folder per project (files + project-description.md)
```

## How to update things (no code changes to the site structure)

| I want to… | Do this |
|---|---|
| **Replace my CV** | Overwrite `assets/documents/resume.pdf` (keep the file name). |
| **Replace my profile picture** | Overwrite `assets/images/profile.png`. Square, ~720–900 px works best. |
| **Add a project** | Create a folder in `projects/`, add its files + screenshot (use a 2:1 image, e.g. 1330×665), then copy an object in `data/projects.json` and set `"published": true`. It appears on the Projects page automatically. |
| **Replace a project screenshot** | Overwrite `projects/<project>/preview.png` (or point `"image"` in `projects.json` to a new file). |
| **Add a certificate / document** | 1) Put the file in `assets/documents/credentials/<category>/`. 2) Optionally add a preview image in `.../credentials/previews/`. 3) Add an item to `data/credentials.json` (set `"file"` and `"preview"`). It shows on `pages/credentials.html` with View / Download buttons. |
| **Change colours** | Edit the variables at the top of `css/style.css` (`:root`). |
| **Change text** | Edit the relevant `.html` file. Navigation and footer are repeated in each page, so edit them in every page if you change them. |
| **Refresh the chart data** | Update `projects/excel-dashboard/sales_summary.csv` (`dimension,label,revenue`). |

## Notes

- **Contact form:** a static site has no server, so the form opens the visitor's email app with the message pre-filled (`mailto:`). To receive messages directly, connect a free form service such as Formspree and set it as the form `action`.
- **Chart.js** loads from the jsDelivr CDN (pinned to v4.4.7). If it cannot load, the page automatically shows the same data as an accessible table. To self-host, download `chart.umd.js` into `js/` and change the `<script>` tag in `pages/projects.html`.
- **Fonts:** Inter from Google Fonts, with a system-font fallback.
- **Accessibility:** skip link, keyboard-friendly navigation, visible focus states, ARIA on the menu/tabs/dialogs, and `prefers-reduced-motion` support (heading zoom, magnetic buttons and reveal animations are disabled/simplified). Hover effects only apply on mouse/trackpad devices.
- The Python / SQL / Power BI project folders are **placeholders** (`"published": false`). Nothing is shown publicly until you add real work and publish it.
