// Edit CONFIG with your real links, then every page updates automatically.
const CONFIG={email:"your.email@example.com",linkedin:"https://www.linkedin.com/in/your-profile",github:"https://github.com/your-username"};
(()=>{
const root=document.body.dataset.root||"",page=document.body.dataset.page;
const nav=[["Home","index.html","home"],["About","pages/about.html","about"],["Skills","pages/skills.html","skills"],["Experience","pages/experience.html","experience"],["Education","pages/education.html","education"],["Training","pages/training.html","training"],["Projects","pages/projects.html","projects"],["Contact","pages/contact.html","contact"]];
document.getElementById("site-header").outerHTML=`<header class="site"><div class="container bar"><a class="logo" href="${root}index.html" aria-label="Home">SR<span>.</span></a><button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Toggle menu">&#9776;</button><nav id="menu" aria-label="Main"><ul>${nav.map(n=>`<li><a href="${root}${n[1]}" ${n[2]===page?'class="active" aria-current="page"':""}>${n[0]}</a></li>`).join("")}</ul></nav><a class="btn btn-secondary sm magnetic" href="${root}pages/contact.html">Let's Connect</a></div></header>`;
document.getElementById("site-footer").outerHTML=`<footer class="site"><div class="container row"><p>&copy; ${new Date().getFullYear()} MD. Saiful Islam Rumman · Dhaka, Bangladesh</p><p><a data-social="linkedin" target="_blank" rel="noopener">LinkedIn</a><a data-social="github" target="_blank" rel="noopener">GitHub</a><a data-social="email">Email</a></p></div></footer>`;
document.querySelectorAll("[data-social]").forEach(a=>{const k=a.dataset.social;a.href=k==="email"?"mailto:"+CONFIG.email:CONFIG[k]});
const b=document.querySelector(".burger"),m=document.getElementById("menu");
const close=()=>{m.classList.remove("open");b.setAttribute("aria-expanded","false")};
b.onclick=()=>{const o=m.classList.toggle("open");b.setAttribute("aria-expanded",o)};
m.addEventListener("click",e=>{if(e.target.closest("a"))close()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
const calm=matchMedia("(prefers-reduced-motion: reduce)").matches,fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
if(fine&&!calm)document.querySelectorAll(".magnetic").forEach(el=>{
 el.addEventListener("mousemove",e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`});
 el.addEventListener("mouseleave",()=>el.style.transform="")});
const f=document.getElementById("contactForm");
if(f)f.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(f);
 location.href=`mailto:${CONFIG.email}?subject=${encodeURIComponent("Portfolio enquiry from "+d.get("name"))}&body=${encodeURIComponent(d.get("message")+"\n\nReply to: "+d.get("email"))}`});
})();
