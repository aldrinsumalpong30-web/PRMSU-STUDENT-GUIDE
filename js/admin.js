import {sb,layout,esc,slugify} from './common.js';layout();
const app=document.getElementById('app');let tab='deps',editId=null;
const SIMPLE={cats:{t:'categories',f:[['category_name','Category name','text'],['description','Description','text']]},blds:{t:'buildings',f:[['building_name','Building','text'],['description','Description','text'],['latitude','Latitude','number'],['longitude','Longitude','number']]}};
async function upload(file){if(!file||!file.size)return null;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2e6){alert('Images must be jpg/png/webp, max 2MB.');return null}
 const p=crypto.randomUUID()+'.'+file.type.split('/')[1].replace('jpeg','jpg');const {error}=await sb.storage.from('department-images').upload(p,file);if(error){alert(error.message);return null}return sb.storage.from('department-images').getPublicUrl(p).data.publicUrl}
function login(msg=''){app.innerHTML=`<div style="max-width:380px"><h3>Admin Login</h3>${msg?`<div class="alert alert-danger">${esc(msg)}</div>`:''}<form id="lf"><input name="e" type="email" class="form-control mb-2" placeholder="Email" required><input name="p" type="password" class="form-control mb-3" placeholder="Password" required><button class="btn btn-gold w-100">Login</button></form></div>`;
 lf.onsubmit=async ev=>{ev.preventDefault();const f=new FormData(lf);const {error}=await sb.auth.signInWithPassword({email:f.get('e'),password:f.get('p')});error?login(error.message):boot()}}
async function boot(){const {data:{session}}=await sb.auth.getSession();if(!session)return login();
 const {data:a}=await sb.from('admins').select('user_id').maybeSingle();if(!a){await sb.auth.signOut();return login('This account is not an administrator.')}render()}
async function render(){
 const [c,b,d]=await Promise.all([sb.from('categories').select('*').order('id'),sb.from('buildings').select('*').order('id'),sb.from('departments').select('*,categories(category_name),buildings(building_name)').order('created_at',{ascending:false})]);
 const cats=c.data||[],blds=b.data||[],deps=d.data||[];
 const tabs=`<div class="mb-3">${[['deps','Departments'],['blds','Buildings'],['cats','Categories']].map(([k,n])=>`<button class="btn btn-sm ${tab===k?'btn-primary':'btn-outline-primary'}" data-tab="${k}">${n}</button>`).join(' ')} <button class="btn btn-sm btn-outline-danger" id="out">Logout</button> <span class="ms-3 small text-muted">${deps.length} departments · ${blds.length} locations · ${cats.length} categories</span></div>`;
 let body='';
 if(tab==='deps'){const e=deps.find(x=>x.id===editId)||{};
  body=`<form id="df" class="bg-white p-3 rounded mb-3"><h5>${e.id?'Edit':'Add'} Department</h5><input name="department_name" class="form-control mb-2" placeholder="Name" required value="${esc(e.department_name)}">
<select name="category_id" class="form-select mb-2">${cats.map(x=>`<option value="${x.id}" ${x.id===e.category_id?'selected':''}>${esc(x.category_name)}</option>`).join('')}</select>
<select name="building_id" class="form-select mb-2"><option value="">— No building —</option>${blds.map(x=>`<option value="${x.id}" ${x.id===e.building_id?'selected':''}>${esc(x.building_name)}</option>`).join('')}</select>
<textarea name="description" class="form-control mb-2" placeholder="Description">${esc(e.description)}</textarea><textarea name="programs" class="form-control mb-2" placeholder="Programs/services, one per line">${esc(e.programs)}</textarea>
<input name="contact_email" type="email" class="form-control mb-2" placeholder="Contact email" value="${esc(e.contact_email)}"><input name="contact_number" class="form-control mb-2" placeholder="Contact number" value="${esc(e.contact_number)}">
<label>Main image</label><input type="file" name="image" accept="image/*" class="form-control mb-2"><label>Gallery images</label><input type="file" name="gallery" multiple accept="image/*" class="form-control mb-2"><button class="btn btn-gold">Save</button> ${e.id?'<button type="button" class="btn btn-link" data-cancel>Cancel</button>':''}</form>
<table class="table bg-white">${deps.map(x=>`<tr><td>${esc(x.department_name)}</td><td>${esc(x.categories?.category_name)}</td><td>${esc(x.buildings?.building_name)}</td><td class="text-end"><button class="btn btn-sm btn-outline-primary" data-edit="${x.id}">Edit</button> <button class="btn btn-sm btn-outline-danger" data-del="deps:${x.id}">Delete</button></td></tr>`).join('')}</table>`}
 else{const S=SIMPLE[tab],rows=tab==='cats'?cats:blds,e=rows.find(x=>x.id===editId)||{};
  body=`<form id="sf" class="row g-2 mb-3">${S.f.map(([k,l,t])=>`<div class="col-md"><input name="${k}" type="${t}" step="any" class="form-control" placeholder="${l}" ${k.endsWith('name')||t==='number'?'required':''} value="${esc(e[k])}"></div>`).join('')}<div class="col-auto"><button class="btn btn-gold">${e.id?'Update':'Add'}</button></div></form>
<table class="table bg-white">${rows.map(x=>`<tr><td>${esc(x[S.f[0][0]])}</td>${tab==='blds'?`<td>${x.latitude}, ${x.longitude}</td>`:''}<td class="text-end">${tab==='blds'?`<a class="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps?q=${x.latitude},${x.longitude}">Preview</a> `:''}<button class="btn btn-sm btn-outline-primary" data-edit="${x.id}">Edit</button> <button class="btn btn-sm btn-outline-danger" data-del="${tab}:${x.id}">Delete</button></td></tr>`).join('')}</table>`}
 app.innerHTML=tabs+body;
 app.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;editId=null;render()});
 out.onclick=async()=>{await sb.auth.signOut();login()};
 app.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{editId=+b.dataset.edit;render();scrollTo(0,0)});
 app.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>{editId=null;render()});
 app.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{if(!confirm('Delete?'))return;const [k,id]=b.dataset.del.split(':');const t=k==='deps'?'departments':SIMPLE[k].t;const {error}=await sb.from(t).delete().eq('id',id);if(error)alert(error.message);render()});
 if(window.df)df.onsubmit=async ev=>{ev.preventDefault();const f=new FormData(df),btn=df.querySelector('.btn-gold');btn.disabled=true;
  const row={department_name:f.get('department_name').trim(),category_id:+f.get('category_id'),building_id:f.get('building_id')?+f.get('building_id'):null,description:f.get('description'),programs:f.get('programs'),contact_email:f.get('contact_email')||null,contact_number:f.get('contact_number'),updated_at:new Date().toISOString()};
  const im=await upload(f.get('image'));if(im)row.image=im;
  let id=editId,err;if(id)({error:err}=await sb.from('departments').update(row).eq('id',id));else{row.slug=slugify(row.department_name)+'-'+Math.random().toString(36).slice(2,6);const r=await sb.from('departments').insert(row).select('id').single();err=r.error;id=r.data?.id}
  if(err)return alert(err.message);
  for(const g of f.getAll('gallery')){const p=await upload(g);if(p)await sb.from('department_images').insert({department_id:id,image_path:p})}
  editId=null;render()};
 if(window.sf)sf.onsubmit=async ev=>{ev.preventDefault();const S=SIMPLE[tab],f=new FormData(sf),row={};S.f.forEach(([k,,t])=>row[k]=t==='number'?+f.get(k):f.get(k));
  const q=editId?sb.from(S.t).update(row).eq('id',editId):sb.from(S.t).insert(row);const {error}=await q;if(error)alert(error.message);editId=null;render()};
}
boot();
