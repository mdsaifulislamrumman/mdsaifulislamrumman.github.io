/* ==========================================================================
   projects.js  ·  renders data/projects.json into the Projects page
   To add a project: add an object to data/projects.json (see README).
   Entries with "published": false are skipped.
   ========================================================================== */
(() => {
  'use strict';
  const mount = document.getElementById('project-list');
  if (!mount) return;
  const ROOT = document.body.dataset.root || './';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = p => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const ICON_DL = icon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>');
  const ICON_ZOOM = icon('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>');

  const card = p => {
    const img = p.image ? `
      <button type="button" class="project-media" data-viewer-src="${esc(ROOT + p.image)}" data-viewer-alt="${esc(p.imageAlt)}" data-viewer-title="${esc(p.title)}" aria-label="Enlarge screenshot: ${esc(p.title)}">
        <img src="${esc(ROOT + p.image)}" alt="${esc(p.imageAlt)}" width="1330" height="665" loading="lazy" decoding="async">
        <span class="zoom-hint">${ICON_ZOOM} Enlarge</span>
      </button>` : '';
    const files = (p.files || []).map(f => `<a class="btn btn-secondary btn-sm" href="${esc(ROOT + f.path)}" download>${ICON_DL}<span>${esc(f.label)}</span></a>`).join('');
    const highlights = (p.highlights || []).map(h => `<li>${esc(h)}</li>`).join('');
    return `
      <article class="card project-card project-card--stack reveal" id="${esc(p.id)}">
        ${img}
        <div class="project-body">
          <div>
            <span class="badge">${esc(p.category)}</span>
            <h3 style="margin-top:.8rem">${esc(p.title)}</h3>
          </div>
          <p>${esc(p.description)}</p>
          ${highlights ? `<ul class="check-list">${highlights}</ul>` : ''}
          <div class="tag-list" aria-label="Tools used">${(p.tools || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <div class="btn-group">${p.showcase ? `<a class="btn btn-primary btn-sm" href="#dashboard-showcase">Explore the data</a>` : ''}${files}</div>
        </div>
      </article>`;
  };

  fetch(ROOT + 'data/projects.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      const list = (data.projects || []).filter(p => p.published !== false);
      if (!list.length) { mount.innerHTML = '<p class="empty-note">Projects will be published here soon.</p>'; return; }
      mount.innerHTML = list.map(card).join('');
      mount.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    })
    .catch(() => {
      mount.innerHTML = '<p class="empty-note">Project details could not be loaded. If you opened this file directly from your computer, run a local web server (see README) or view the live site.</p>';
    });
})();
