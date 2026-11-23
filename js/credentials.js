/* ==========================================================================
   credentials.js  ·  renders data/credentials.json with category filters and previews
   Add a document: 1) put the file in assets/documents/credentials/<category>/
                   2) (optional) put a preview image in …/credentials/previews/
                   3) add an item to data/credentials.json
   ========================================================================== */
(() => {
  'use strict';
  const mount = document.getElementById('credentials-list');
  const bar = document.getElementById('credentials-filter');
  if (!mount || !bar) return;
  const ROOT = document.body.dataset.root || './';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = p => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const I_FILE = icon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>');
  const I_EYE = icon('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>');
  const I_DL = icon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>');

  let categories = [], items = [], active = 'all';

  const card = it => {
    const cat = categories.find(c => c.id === it.category) || {};
    const hasFile = Boolean(it.file);
    const isPdf = hasFile && /\.pdf$/i.test(it.file);
    const thumb = it.preview
      ? `<div class="cred-thumb"><img src="${esc(ROOT + it.preview)}" alt="Preview of ${esc(it.title)}" loading="lazy" decoding="async"></div>`
      : `<div class="cred-thumb" aria-hidden="true">${I_FILE}</div>`;
    const actions = hasFile ? `
      <div class="btn-group">
        <button type="button" class="btn btn-primary btn-sm" data-viewer-type="${isPdf ? 'pdf' : 'image'}" data-viewer-src="${esc(ROOT + (isPdf ? it.file : (it.preview || it.file)))}" data-viewer-title="${esc(it.title)}" data-viewer-alt="${esc(it.title)}">${I_EYE}<span>View</span></button>
        <a class="btn btn-secondary btn-sm" href="${esc(ROOT + it.file)}" download>${I_DL}<span>Download</span></a>
      </div>` : `<p class="pending">Document file to be added.</p>`;
    return `
      <article class="card cred-card card--hover">
        ${thumb}
        <div><span class="badge">${esc(cat.label || it.category)}</span></div>
        <h3>${esc(it.title)}</h3>
        <p class="meta">${esc([it.issuer, it.date].filter(Boolean).join(' · '))}</p>
        ${it.description ? `<p>${esc(it.description)}</p>` : ''}
        ${actions}
      </article>`;
  };

  const render = () => {
    const shown = items.filter(i => active === 'all' || i.category === active);
    mount.innerHTML = shown.length
      ? shown.map(card).join('')
      : '<p class="empty-note" style="grid-column:1/-1">No documents in this category yet.</p>';
    bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === active)));
  };

  fetch(ROOT + 'data/credentials.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      categories = data.categories || [];
      items = (data.items || []).filter(i => i.published !== false);
      bar.innerHTML = [{ id: 'all', label: 'All' }, ...categories].map(c =>
        `<button type="button" class="chart-tab" data-cat="${esc(c.id)}" aria-pressed="false">${esc(c.label)}</button>`).join('');
      bar.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { active = b.dataset.cat; render(); } });
      render();
    })
    .catch(() => { mount.innerHTML = '<p class="empty-note" style="grid-column:1/-1">Documents could not be loaded. If you opened this file directly from your computer, run a local web server (see README).</p>'; });
})();
