# Portfolio: MD. Saiful Islam Rumman

Static site (HTML, CSS, vanilla JS, Chart.js). No backend required.

## Publish on GitHub Pages
1. Create a repository and upload the **contents** of this folder (index.html at the repo root).
2. Settings > Pages > Deploy from branch > `main` / root.
3. Your site appears at `https://<username>.github.io/<repo>/`. All paths are relative, so project sites work.

## Before publishing
- Edit `CONFIG` at the top of `js/script.js` (email, LinkedIn, GitHub).
- Add `assets/images/profile.jpg` (a placeholder shows until then) and `assets/documents/CV.pdf` (the Download CV button needs it).
- Add experience dates in `pages/experience.html`; add maintenance and customer service roles by copying a timeline item.
- Fill `data/projects.json`, `data/credentials.json`, and the files in `projects/`.

## Preview locally
Browsers block `fetch` on `file://`. Run `python -m http.server` in this folder and open http://localhost:8000.
