/* ==========================================================================
   script.js  ·  core behaviour shared by every page
   Navigation · scroll reveal · magnetic buttons · back-to-top ·
   media viewer dialog (window.PF.openViewer) · copy buttons
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const ROOT = document.body.dataset.root || './';          // "./" on index.html, "../" inside /pages

  /* ---------- Sticky header shadow ---------- */
  const header = $('.site-header');
  const onScroll = () => {
    header && header.classList.toggle('is-scrolled', window.scrollY > 8);
    const top = $('.to-top');
    top && top.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  const toggle = $('.nav-toggle');
  const menu = $('#site-nav');
  if (header && toggle && menu) {
    const setOpen = (open, returnFocus = false) => {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open && returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
    // Close after choosing a destination
    $$('a', menu).forEach(a => a.addEventListener('click', () => setOpen(false)));
    // Escape closes and returns focus
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) setOpen(false, true);
    });
    // Click outside closes
    document.addEventListener('click', e => {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    // Reset when growing to desktop
    window.matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealEls.forEach(el => io.observe(el));
    }
  }

  /* ---------- Magnetic hover (only elements marked data-magnetic; fine pointers only) ---------- */
  if (finePointer.matches && !reduceMotion.matches) {
    const STRENGTH = 0.22, MAX = 7;                          // keep it subtle
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        el.style.setProperty('--mx', Math.max(-MAX, Math.min(MAX, dx)) + 'px');
        el.style.setProperty('--my', Math.max(-MAX, Math.min(MAX, dy)) + 'px');
      });
      el.addEventListener('mouseleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
    });
  }

  /* ---------- Back to top ---------- */
  const topBtn = $('.to-top');
  topBtn && topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' }));

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Media viewer (images / PDFs) — shared by projects & credentials ---------- */
  const viewer = {
    dlg: null,
    opener: null,
    build() {
      const d = document.createElement('dialog');
      d.className = 'viewer';
      d.setAttribute('aria-labelledby', 'viewer-title');
      d.innerHTML = `
        <div class="viewer-bar"><h2 id="viewer-title"></h2>
          <button type="button" class="viewer-close" aria-label="Close preview">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button></div>
        <div class="viewer-body"></div>`;
      document.body.appendChild(d);
      $('.viewer-close', d).addEventListener('click', () => d.close());
      d.addEventListener('click', e => { if (e.target === d) d.close(); });          // backdrop click
      d.addEventListener('close', () => { $('.viewer-body', d).innerHTML = ''; this.opener && this.opener.focus(); });
      this.dlg = d;
    },
    open({ type = 'image', src, alt = '', title = '' }, opener) {
      if (!this.dlg) this.build();
      this.opener = opener || document.activeElement;
      $('#viewer-title', this.dlg).textContent = title;
      const body = $('.viewer-body', this.dlg);
      body.innerHTML = '';
      if (type === 'pdf') {
        const f = document.createElement('iframe'); f.src = src; f.title = title || 'Document preview'; body.appendChild(f);
      } else {
        const i = document.createElement('img'); i.src = src; i.alt = alt; body.appendChild(i);
      }
      this.dlg.showModal();
    }
  };
  window.PF = { root: ROOT, openViewer: (o, el) => viewer.open(o, el), reduceMotion: () => reduceMotion.matches };

  // Declarative triggers: <button data-viewer-src="…" data-viewer-title="…" data-viewer-alt="…">
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-viewer-src]');
    if (!t) return;
    e.preventDefault();
    window.PF.openViewer({ type: t.dataset.viewerType || 'image', src: t.dataset.viewerSrc, alt: t.dataset.viewerAlt || '', title: t.dataset.viewerTitle || '' }, t);
  });

  /* ---------- Copy-to-clipboard buttons ---------- */
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const label = $('span', btn); const original = label ? label.textContent : '';
    try { await navigator.clipboard.writeText(btn.dataset.copy); if (label) label.textContent = 'Copied'; }
    catch { if (label) label.textContent = 'Press Ctrl+C to copy'; }
    setTimeout(() => { if (label) label.textContent = original; }, 2000);
  }));
})();
