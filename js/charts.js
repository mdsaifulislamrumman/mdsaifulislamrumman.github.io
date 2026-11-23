/* ==========================================================================
   charts.js  ·  Chart.js showcase for the Excel Sales Dashboard project
   Data: projects/excel-dashboard/sales_summary.csv (aggregated from sales_data.xlsx)
   Columns: dimension,label,revenue
   If Chart.js (CDN) cannot load, the accessible data table is shown instead.
   ========================================================================== */
(() => {
  'use strict';
  const box = document.getElementById('chart-box');
  if (!box) return;
  const ROOT = document.body.dataset.root || './';
  const canvas = document.getElementById('revenue-chart');
  const tabs = document.getElementById('chart-tabs');
  const tableBody = document.getElementById('chart-table-body');
  const tableHead = document.getElementById('chart-table-head');
  const tableWrap = document.getElementById('chart-table');
  const status = document.getElementById('chart-status');

  const VIEWS = {
    month:       { label: 'Revenue by Month',          col: 'Month',            type: 'line' },
    region:      { label: 'Revenue by Region',         col: 'Region',           type: 'bar' },
    category:    { label: 'Revenue by Product Category', col: 'Product category', type: 'bar' },
    channel:     { label: 'Revenue by Sales Channel',  col: 'Sales channel',    type: 'bar' },
    top_product: { label: 'Top 5 Products by Revenue', col: 'Product',          type: 'bar', horizontal: true }
  };
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

  let data = {}, chart = null, current = 'month';

  const parseCSV = text => {
    const [head, ...lines] = text.trim().split(/\r?\n/);
    const cols = head.split(',');
    return lines.map(l => { const p = l.split(','); return Object.fromEntries(cols.map((c, i) => [c, p[i]])); });
  };

  const renderTable = key => {
    const v = VIEWS[key];
    tableHead.innerHTML = `<tr><th scope="col">${v.col}</th><th scope="col">Revenue (USD)</th></tr>`;
    tableBody.innerHTML = data[key].map(r => `<tr><td>${r.label}</td><td>${usd.format(r.revenue)}</td></tr>`).join('');
  };

  const renderChart = key => {
    const v = VIEWS[key], rows = data[key];
    renderTable(key);
    canvas.setAttribute('aria-label', `${v.label}: ${rows.map(r => `${r.label} ${usd.format(r.revenue)}`).join(', ')}`);
    if (typeof Chart === 'undefined') return;
    if (chart) chart.destroy();
    const accent = '#3478F6', navy = '#142B4A', grid = '#E5E7EB', text = '#424B57';
    const horizontal = Boolean(v.horizontal);
    chart = new Chart(canvas, {
      type: v.type,
      data: {
        labels: rows.map(r => r.label),
        datasets: [{
          label: 'Revenue (USD)', data: rows.map(r => r.revenue),
          backgroundColor: accent, borderColor: accent, borderWidth: v.type === 'line' ? 2.5 : 0,
          borderRadius: v.type === 'bar' ? 4 : 0, tension: .3, pointRadius: v.type === 'line' ? 4 : 0, pointBackgroundColor: '#fff', pointBorderWidth: 2,
          maxBarThickness: 56
        }]
      },
      options: {
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true, maintainAspectRatio: false,
        animation: window.PF && window.PF.reduceMotion() ? false : { duration: 500 },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: navy, padding: 10, callbacks: { label: c => ' ' + usd.format(c.parsed[horizontal ? 'x' : 'y']) } }
        },
        scales: {
          x: { grid: { display: horizontal, color: grid }, ticks: { color: text, callback: horizontal ? (val => '$' + compact.format(val)) : undefined } },
          y: { beginAtZero: true, grid: { display: !horizontal, color: grid }, ticks: { color: text, callback: horizontal ? undefined : (val => '$' + compact.format(val)) } }
        }
      }
    });
  };

  const select = key => {
    current = key;
    tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.key === key)));
    renderChart(key);
  };

  tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) select(b.dataset.key); });
  // Arrow-key navigation between tabs
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const btns = [...tabs.querySelectorAll('button')]; const i = btns.findIndex(b => b === document.activeElement);
    const next = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
    next.focus(); select(next.dataset.key);
  });

  fetch(ROOT + 'projects/excel-dashboard/sales_summary.csv')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(text => {
      parseCSV(text).forEach(r => { (data[r.dimension] = data[r.dimension] || []).push({ label: r.label, revenue: Number(r.revenue) }); });
      Object.keys(VIEWS).forEach(k => { if (!data[k]) delete VIEWS[k]; });
      tabs.innerHTML = Object.entries(VIEWS).map(([k, v]) => `<button type="button" role="tab" class="chart-tab" data-key="${k}" aria-selected="false">${v.label.replace('Revenue by ', '')}</button>`).join('');
      status.hidden = true;
      if (typeof Chart === 'undefined') {
        box.hidden = true; tableWrap.open = true;
        status.hidden = false; status.textContent = 'The interactive chart library could not be loaded, so the data is shown as a table.';
      }
      select(current);
    })
    .catch(() => { box.hidden = true; tabs.hidden = true; status.textContent = 'Chart data could not be loaded. If you opened this file directly from your computer, run a local web server (see README).'; });
})();
