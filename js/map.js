import {sb,layout,esc,dir,CFG,SEL} from './common.js';layout();
const COL=['#0b2d6b','#c0392b','#27ae60','#f2b705','#8e44ad'];let markers=[];
const {data:all}=await sb.from('departments').select(SEL);const data=(all||[]).filter(d=>d.buildings);
const dept=new URLSearchParams(location.search).get('dept');
const card=d=>`<div style="max-width:230px"><img src="${esc(d.image||'https://placehold.co/300x150?text=PRMSU')}" style="width:100%"><h6>${esc(d.department_name)}</h6><small>${esc(d.buildings.building_name)} · ${esc(d.categories?.category_name)}</small><p>${esc((d.description||'').slice(0,90))}</p><a href="department.html?slug=${encodeURIComponent(d.slug)}">View Details</a> | <a target="_blank" rel="noopener" href="${dir(d.buildings.latitude,d.buildings.longitude)}">Get Directions</a></div>`;
// Leaflet + OpenStreetMap (free, no API key)
const map=L.map('map').setView([CFG.MAP_LAT,CFG.MAP_LNG],16);
const street=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
const sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Tiles &copy; Esri'});
L.control.layers({'Map':street,'Satellite':sat}).addTo(map);
window.focusDept=i=>{const m=markers[i];if(!m)return;map.setView(m.getLatLng(),18);m.openPopup()};
const hit=(d,q)=>(d.department_name+d.buildings.building_name).toLowerCase().includes(q);
function render(q=''){q=q.toLowerCase();list.innerHTML=data.map((d,i)=>hit(d,q)?`<div class="col-md-4"><button class="btn btn-outline-primary w-100 text-start" onclick="focusDept(${i})">${esc(d.department_name)}</button></div>`:'').join('');markers.forEach((m,i)=>hit(data[i],q)?m.addTo(map):map.removeLayer(m))}
data.forEach(d=>{markers.push(L.circleMarker([d.buildings.latitude,d.buildings.longitude],{radius:9,fillColor:COL[(d.category_id-1)%5],fillOpacity:1,color:'#fff',weight:2}).bindPopup(card(d)).bindTooltip(d.department_name).addTo(map))});
render();q.oninput=e=>render(e.target.value);
legend.innerHTML=[...new Map(data.map(d=>[d.category_id,d.categories?.category_name])).entries()].map(([id,n])=>`<span style="color:${COL[(id-1)%5]}">●</span> ${esc(n)} &nbsp;`).join('');
const i=data.findIndex(d=>d.slug===dept);if(i>=0)focusDept(i);
