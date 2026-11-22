(async()=>{const el=document.getElementById("projects");if(!el)return;
try{const r=await fetch("../data/projects.json");const list=await r.json();
el.innerHTML=list.map(p=>`<article class="card"><h3 class="zoom">${p.title}</h3><p class="meta">${p.type} · ${p.status}</p><p>${p.description}</p><div class="tags">${p.tools.map(t=>`<span>${t}</span>`).join("")}</div><p class="meta">Files: <code>projects/${p.folder}/</code></p></article>`).join("")}
catch(e){el.innerHTML='<p class="note">Could not load data/projects.json. If you opened this file directly, serve the folder (e.g. python -m http.server) or use GitHub Pages.</p>'}})();
