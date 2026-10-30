import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
import {CFG} from './config.js';
export {CFG};
export const sb=createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY);
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const dir=(a,b)=>`https://www.google.com/maps/dir/?api=1&destination=${a},${b}`;
export const img=p=>esc(p||'https://placehold.co/600x400/0b2d6b/f2b705?text=PRMSU');
export const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
export function layout(root=''){
 document.body.insertAdjacentHTML('afterbegin',`<nav class="navbar navbar-expand-lg navbar-dark navbar-prmsu sticky-top"><div class="container"><a class="navbar-brand" href="index.html"><i class="fa-solid fa-graduation-cap gold"></i> PRMSU Campus Explorer</a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#n"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="n"><ul class="navbar-nav ms-auto"><li class="nav-item"><a class="nav-link" href="index.html">Home</a></li><li class="nav-item"><a class="nav-link" href="map.html">Campus Map</a></li><li class="nav-item"><a class="nav-link" href="departments.html">Directory</a></li><li class="nav-item"><a class="nav-link" href="admin.html">Admin</a></li></ul></div></div></nav>`);
 document.body.insertAdjacentHTML('beforeend',`<footer class="footer-prmsu mt-5 py-4"><div class="container text-center small">PRMSU Campus Explorer &middot; Unofficial campus guide. Verify institutional details at the official PRMSU website.</div></footer><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"><\/script>`);
 if(CFG.SUPABASE_URL.includes('YOUR-'))document.body.insertAdjacentHTML('afterbegin','<div class="alert alert-warning m-0 rounded-0">Set your Supabase URL and anon key in js/config.js.</div>');
}
export const card=d=>`<div class="col-md-4"><div class="card h-100"><img class="card-img-top" src="${img(d.image)}" alt=""><div class="card-body"><span class="badge bg-primary">${esc(d.categories?.category_name)}</span><h5 class="mt-2">${esc(d.department_name)}</h5><p class="small text-muted"><i class="fa-solid fa-location-dot"></i> ${esc(d.buildings?.building_name||'No building assigned')}</p><p class="small">${esc((d.description||'').slice(0,110))}</p><a class="btn btn-sm btn-outline-primary" href="department.html?slug=${encodeURIComponent(d.slug)}">Details</a> <a class="btn btn-sm btn-gold" href="map.html?dept=${encodeURIComponent(d.slug)}">View on Map</a>${d.buildings?` <a class="btn btn-sm btn-outline-success" target="_blank" rel="noopener" href="${dir(d.buildings.latitude,d.buildings.longitude)}">Directions</a>`:''}</div></div></div>`;
export const SEL='*,categories(category_name),buildings(building_name,latitude,longitude)';
