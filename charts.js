(async()=>{const c=document.getElementById("salesChart"),n=document.getElementById("chartNote");if(!c||!window.Chart)return;
try{const t=await (await fetch("../projects/excel-dashboard/sales_data.csv")).text();
const rows=t.trim().split(/\r?\n/).slice(1).map(l=>l.split(",")).filter(r=>r.length>1&&!isNaN(+r[1]));
if(!rows.length){c.parentElement.style.display="none";n.textContent="No data yet. Add rows to projects/excel-dashboard/sales_data.csv to display a chart here.";return}
new Chart(c,{type:"bar",data:{labels:rows.map(r=>r[0]),datasets:[{label:"Value",data:rows.map(r=>+r[1]),backgroundColor:"#3478F6"}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}})}
catch(e){c.parentElement.style.display="none";n.textContent="Chart data could not be loaded."}})();
