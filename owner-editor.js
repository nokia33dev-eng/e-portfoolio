/* E-Portfoolio owner-only on-site editor.
   Authentication: GitHub's API, fine-grained repository token in memory ONLY.
   Never store credentials in source, localStorage, or on the public website. */
(function(){
'use strict';
const OWNER='nokia33dev-eng';
const REPO='e-portfoolio';
const API='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/';
const CONTENT_FILE='site-content.json';
const root=document.getElementById('content');
const header=document.querySelector('.new-header')||document.querySelector('header');
if(!root||!header)return;

let token='';
let editing=false;
let page='Home';
let data={version:1,pages:{}};
let changes={};
let busy=false;
const textSelectors='h1,h2,h3,p,li,figcaption,.hero-id,.profession-sign > span';
const skipSelector='.owner-extras,.ny-countdown,.ny-welcome,.ny-garland,.ny-switch,.cinematic-toggle,.hero-quicklinks,.contact-grid,.owner-dialog';

function el(tag,cls,text){
 const n=document.createElement(tag);if(cls)n.className=cls;
 if(text!==undefined)n.textContent=text;
 return n;
}
function validData(obj){
 if(!obj||typeof obj!=='object'||!obj.pages||typeof obj.pages!=='object')return {version:1,pages:{}};
 return obj;
}
function pageData(source,p){
 const v=source.pages&&source.pages[p];return v&&typeof v==='object'?v:{};
}
function pageChanges(p){
 if(!changes[p])changes[p]={};return changes[p];
}
function currentPage(){
 try{return typeof current==='string'&&current?current:page}catch(e){return page}
}
function effective(p){
 const stored=pageData(data,p),draft=changes[p]||{};
 return {
  texts:Object.assign({},stored.texts||{},draft.texts||{}),
  images:Object.assign({},stored.images||{},draft.images||{}),
  photos:Array.isArray(draft.photos)?draft.photos:(Array.isArray(stored.photos)?stored.photos:[]),
  blocks:Array.isArray(draft.blocks)?draft.blocks:(Array.isArray(stored.blocks)?stored.blocks:[])
 };
}
function editableTexts(){
 const counters={};
 return Array.from(root.querySelectorAll(textSelectors)).filter(n=>{
  if(n.closest(skipSelector))return false;
  if(n.querySelector('a,button,input,textarea,img,iframe,video'))return false;
  if(!n.textContent.trim())return false;
  return true;
 }).map(n=>{
  const tag=n.tagName.toLowerCase();
  const key=tag+':'+(counters[tag]||0);
  counters[tag]=(counters[tag]||0)+1;
  n.dataset.ownerText=key;
  return n;
 });
}
function editableImages(){
 return Array.from(root.querySelectorAll('img')).filter(n=>!n.closest('.owner-extras,.hero-blades,.brand-symbol,.profession-sign,.owner-dialog,.ny-countdown')).map((n,i)=>{
  n.dataset.ownerImage='image:'+i;return n;
 });
}
function asImageUrl(value){
 if(typeof value!=='string')return null;
 if(value.startsWith('./uploads/')&&/^[a-z0-9._/-]+$/i.test(value.slice(2)))return value;
 try{const u=new URL(value,location.href);return u.protocol==='https:'?u.href:null}catch(e){return null}
}
function applyContent(){
 page=currentPage();
 const v=effective(page);
 editableTexts().forEach(n=>{
  const key=n.dataset.ownerText;
  if(Object.prototype.hasOwnProperty.call(v.texts,key)&&typeof v.texts[key]==='string'){
   if(n.textContent!==v.texts[key])n.textContent=v.texts[key];
  }
  if(editing){n.setAttribute('contenteditable','plaintext-only');n.spellcheck=true}
  else{n.removeAttribute('contenteditable');n.removeAttribute('spellcheck')}
 });
 editableImages().forEach(n=>{
  const url=asImageUrl(v.images[n.dataset.ownerImage]);
  if(url&&n.getAttribute('src')!==url)n.setAttribute('src',url);
  n.classList.toggle('owner-replaceable',editing);
  if(editing)n.title='Нажми, чтобы заменить фотографию';
  else n.removeAttribute('title');
 });
 renderExtras(v);
 root.classList.toggle('owner-editing',editing);
 toolbar.hidden=!token;
 toolbar.querySelector('[data-action="edit"]').textContent=editing?'✓ Закончить':'✎ Редактировать';
}
function markUnsaved(){
 status.textContent='● Есть несохранённые изменения';
 status.classList.add('unsaved');
}
function renderExtras(v){
 const existing=root.querySelector('.owner-extras');
 if(existing)existing.remove();
 if(!v.blocks.length&&!v.photos.length&&!editing)return;
 const section=el('section','owner-extras');
 section.setAttribute('aria-label','Мои дополнительные материалы');
 if(v.blocks.length){
  const wrap=el('div','owner-extra-notes');
  v.blocks.forEach((item,index)=>{
   const card=el('div','owner-note');
   const paragraph=el('p','owner-note-text',String(item.text||''));
   if(editing){
    paragraph.setAttribute('contenteditable','plaintext-only');
    paragraph.dataset.noteIndex=String(index);
    paragraph.spellcheck=true;
    const remove=el('button','owner-remove','× Удалить текст');
    remove.type='button';
    remove.onclick=()=>{const next=effective(page).blocks.map(x=>({...x}));next.splice(index,1);pageChanges(page).blocks=next;renderExtras(effective(page));markUnsaved()};
    card.append(paragraph,remove);
   }else card.appendChild(paragraph);
   wrap.appendChild(card);
  });
  section.appendChild(wrap);
 }
 if(v.photos.length){
  const gallery=el('div','owner-gallery');
  const heading=el('h2','owner-gallery-title','Minu fotod');
  gallery.appendChild(heading);
  const grid=el('div','owner-photo-grid');
  v.photos.forEach((item,index)=>{
   const url=asImageUrl(item.src);if(!url)return;
   const figure=el('figure','owner-photo');
   const img=el('img','');img.src=url;img.alt=String(item.caption||'Portfoolio foto');img.loading='lazy';
   const caption=el('figcaption','owner-photo-caption',String(item.caption||'Minu foto'));
   if(editing){
    caption.setAttribute('contenteditable','plaintext-only');caption.dataset.photoIndex=String(index);
    const remove=el('button','owner-remove','× Удалить фото');
    remove.type='button';
    remove.onclick=()=>{const next=effective(page).photos.map(x=>({...x}));next.splice(index,1);pageChanges(page).photos=next;renderExtras(effective(page));markUnsaved()};
    figure.append(img,caption,remove);
   }else figure.append(img,caption);
   grid.appendChild(figure);
  });
  gallery.appendChild(grid);section.appendChild(gallery);
 }
 root.appendChild(section);
}
function setMessage(msg,isError){
 status.textContent=msg;
 status.classList.toggle('owner-error',!!isError);
 if(!isError)status.classList.remove('unsaved');
}
function encode(str){
 const bytes=new TextEncoder().encode(str);
 let binary='';
 for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return btoa(binary);
}
function decode(base64){
 const b=atob(base64.replace(/\s/g,''));
 const bytes=Uint8Array.from(b,c=>c.charCodeAt(0));
 return new TextDecoder().decode(bytes);
}
async function github(path,options){
 if(!token)throw new Error('Сначала войди как владелец.');
 const response=await fetch(path,{...options,headers:{
  'Accept':'application/vnd.github+json',
  'Authorization':'Bearer '+token,
  'X-GitHub-Api-Version':'2022-11-28',
  ...(options&&options.headers||{})
 }});
 const json=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error((json.message||'GitHub API error')+' ('+response.status+')');
 return json;
}
async function refreshPublic(){
 try{
  const r=await fetch('./'+CONTENT_FILE+'?v='+Date.now(),{cache:'no-store'});
  if(r.ok)data=validData(await r.json());
 }catch(e){console.warn('Owner content not yet available:',e)}
 applyContent();
}
async function authenticate(){
 const field=dialog.querySelector('#owner-token');
 const next=field.value.trim();
 if(next.length<24){dialogMessage.textContent='Введи GitHub-токен доступа к репозиторию.';return}
 dialogMessage.textContent='Проверяю доступ через GitHub…';
 loginButton.disabled=true;
 try{
  const r=await fetch('https://api.github.com/user',{headers:{
   'Accept':'application/vnd.github+json','Authorization':'Bearer '+next,
   'X-GitHub-Api-Version':'2022-11-28'
  }});
  const u=await r.json();
  if(!r.ok)throw new Error('Токен недействителен или истёк.');
  if(String(u.login||'').toLowerCase()!==OWNER)throw new Error('Только владелец репозитория '+OWNER+' может войти.');
  token=next;field.value='';dialog.hidden=true;
  pencil.setAttribute('aria-label','Открыть редактор владельца');
  editing=true;
  setMessage('Вы вошли как владелец. Нажимай на текст или фото для изменения.',false);
  applyContent();
 }catch(e){dialogMessage.textContent=String(e.message||e);field.value='';token=''}
 finally{loginButton.disabled=false}
}
async function fileToBase64(file){
 return new Promise((resolve,reject)=>{
  const r=new FileReader();
  r.onload=()=>resolve(String(r.result).split(',')[1]);
  r.onerror=()=>reject(new Error('Не удалось прочитать файл.'));
  r.readAsDataURL(file);
 });
}
async function uploadPhoto(file,replaceKey){
 if(!token||!editing)return;
 const allowed={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};
 if(!allowed[file.type]){setMessage('Разрешены JPG, PNG, WebP и GIF.',true);return}
 if(file.size>5*1024*1024){setMessage('Фото должно быть не больше 5 МБ.',true);return}
 busy=true;updateBusy();setMessage('Загружаю фото в GitHub…',false);
 try{
  const suffix=Date.now()+'-'+Math.random().toString(36).slice(2,8);
  const path='uploads/photo-'+suffix+'.'+allowed[file.type];
  const b64=await fileToBase64(file);
  await github(API+path,{method:'PUT',body:JSON.stringify({
   message:'Upload portfolio photo via owner editor',content:b64,branch:'main'
  })});
  const src='./'+path;
  if(replaceKey){
   const draft=pageChanges(page);if(!draft.images)draft.images={};
   draft.images[replaceKey]=src;
  }else{
   const next=effective(page).photos.map(x=>({...x}));
   next.push({src,caption:'Minu foto'});
   pageChanges(page).photos=next;
  }
  applyContent();markUnsaved();
  status.textContent='Фото загружено. Нажми «Сохранить», чтобы опубликовать изменение на странице.';
 }catch(e){setMessage('Ошибка загрузки: '+String(e.message||e),true)}
 finally{busy=false;updateBusy()}
}
async function saveChanges(){
 if(!token||busy)return;
 const pending=Object.keys(changes).filter(p=>Object.keys(changes[p]).length);
 if(!pending.length){setMessage('Нет несохранённых изменений.',false);return}
 busy=true;updateBusy();setMessage('Сохраняю изменения в GitHub…',false);
 try{
  const remote=await github(API+CONTENT_FILE+'?ref=main');
  const obj=validData(JSON.parse(decode(remote.content)));
  if(!obj.pages)obj.pages={};
  for(const name of pending){
   const prior=pageData(obj,name),draft=changes[name];
   const merged={...prior};
   if(draft.texts)merged.texts={...(prior.texts||{}),...draft.texts};
   if(draft.images)merged.images={...(prior.images||{}),...draft.images};
   if(draft.photos)merged.photos=draft.photos;
   if(draft.blocks)merged.blocks=draft.blocks;
   obj.pages[name]=merged;
  }
  await github(API+CONTENT_FILE,{method:'PUT',body:JSON.stringify({
   message:'Edit E-Portfoolio content via owner editor',content:encode(JSON.stringify(obj,null,2)+'\n'),
   sha:remote.sha,branch:'main'
  })});
  data=obj;changes={};
  setMessage('✓ Сохранено в GitHub! На сайте станет видно после публикации GitHub Pages.',false);
 }catch(e){setMessage('Не удалось сохранить: '+String(e.message||e),true)}
 finally{busy=false;updateBusy()}
}
function updateBusy(){
 toolbar.querySelectorAll('button').forEach(b=>b.disabled=busy);
}
function onFileSelected(){
 const files=fileInput.files;
 if(files&&files[0])uploadPhoto(files[0],fileInput.dataset.replaceKey||'');
 fileInput.value='';delete fileInput.dataset.replaceKey;
}
function openDialog(){
 dialog.hidden=false;dialogMessage.textContent='';
 dialog.querySelector('#owner-token').value='';
 dialog.querySelector('#owner-token').focus();
}
const pencil=el('button','owner-pencil','✎');
pencil.type='button';
pencil.title='Редактор владельца';
pencil.setAttribute('aria-label','Редактор владельца — вход');
header.appendChild(pencil);
const dialog=el('div','owner-dialog');
dialog.hidden=true;
dialog.innerHTML='<section class="owner-modal" role="dialog" aria-modal="true" aria-labelledby="owner-dialog-title">'+
 '<button class="owner-close" type="button" aria-label="Закрыть">×</button>'+
 '<div class="owner-modal-icon">✎</div>'+
 '<h2 id="owner-dialog-title">Только владелец может использовать редактор сайта</h2>'+
 '<p>Для безопасности здесь нужен <strong>GitHub-токен</strong>, а не пароль от электронной почты. Никому не отправляй свой пароль или токен.</p>'+
 '<label for="owner-token">GitHub personal access token</label>'+
 '<input id="owner-token" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" />'+
 '<button type="button" class="owner-login">Войти как владелец</button>'+
 '<p class="owner-dialog-message" role="status"></p>'+
 '<p class="owner-help">Создай <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">fine-grained token в GitHub</a>: только репозиторий <strong>e-portfoolio</strong>, право <strong>Contents: Read and write</strong>, короткий срок действия. Токен используется только в этом браузере и не сохраняется.</p>'+
 '</section>';
document.body.appendChild(dialog);
const loginButton=dialog.querySelector('.owner-login');
const dialogMessage=dialog.querySelector('.owner-dialog-message');
loginButton.onclick=authenticate;
dialog.querySelector('.owner-close').onclick=()=>{dialog.hidden=true};
dialog.querySelector('#owner-token').addEventListener('keydown',e=>{if(e.key==='Enter')authenticate()});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')dialog.hidden=true});

const toolbar=el('div','owner-toolbar');
toolbar.hidden=true;
toolbar.innerHTML='<div class="owner-tools"><button type="button" data-action="edit">✎ Редактировать</button><button type="button" data-action="text">＋ Текст</button><button type="button" data-action="photo">＋ Фото</button><button type="button" data-action="save">💾 Сохранить</button><button type="button" data-action="logout">Выйти</button></div><p class="owner-status" role="status"></p>';
document.body.appendChild(toolbar);
const status=toolbar.querySelector('.owner-status');
const fileInput=el('input','owner-file');
fileInput.type='file';fileInput.accept='image/jpeg,image/png,image/webp,image/gif';
fileInput.hidden=true;document.body.appendChild(fileInput);
fileInput.addEventListener('change',onFileSelected);

pencil.onclick=()=>{
 if(!token){openDialog();return}
 toolbar.hidden=!toolbar.hidden;
};
toolbar.addEventListener('click',e=>{
 const b=e.target.closest('button[data-action]');if(!b||busy)return;
 const action=b.dataset.action;
 if(action==='edit'){editing=!editing;applyContent();setMessage(editing?'Режим редактирования включён. Нажми на текст или фото.':'Режим просмотра включён.',false)}
 if(action==='text'){
  if(!editing){editing=true;applyContent()}
  const blocks=effective(page).blocks.map(x=>({...x}));
  blocks.push({id:String(Date.now()),text:'Новый текст — нажми и напиши здесь.'});
  pageChanges(page).blocks=blocks;
  applyContent();markUnsaved();
  const note=root.querySelector('.owner-note:last-child .owner-note-text');if(note){note.focus();note.scrollIntoView({behavior:'smooth',block:'center'})}
 }
 if(action==='photo'){if(!editing){editing=true;applyContent()}fileInput.click()}
 if(action==='save')saveChanges();
 if(action==='logout'){
  token='';editing=false;toolbar.hidden=true;changes={};applyContent();setMessage('Вы вышли.',false);
  pencil.setAttribute('aria-label','Редактор владельца — вход');
 }
});
root.addEventListener('click',e=>{
 if(!editing||!token)return;
 const image=e.target.closest('img[data-owner-image]');
 if(!image)return;
 e.preventDefault();e.stopPropagation();
 fileInput.dataset.replaceKey=image.dataset.ownerImage;fileInput.click();
},true);
root.addEventListener('input',e=>{
 if(!editing||!token)return;
 const text=e.target.closest('[data-owner-text]');
 if(text&&!text.closest('.owner-extras')){
  const draft=pageChanges(page);if(!draft.texts)draft.texts={};
  draft.texts[text.dataset.ownerText]=text.textContent;
  markUnsaved();return;
 }
 const note=e.target.closest('[data-note-index]');
 if(note){
  const next=effective(page).blocks.map(x=>({...x}));
  const i=Number(note.dataset.noteIndex);if(next[i])next[i].text=note.textContent;
  pageChanges(page).blocks=next;markUnsaved();return;
 }
 const caption=e.target.closest('[data-photo-index]');
 if(caption){
  const next=effective(page).photos.map(x=>({...x}));
  const i=Number(caption.dataset.photoIndex);if(next[i])next[i].caption=caption.textContent;
  pageChanges(page).photos=next;markUnsaved();
 }
});
root.addEventListener('keydown',e=>{
 if(!editing||!token)return;
 if(e.key==='Enter'&&e.target.closest('[data-owner-text]')){e.preventDefault();e.target.blur()}
});

if(typeof window.show==='function'){
 const previousShow=window.show;
 window.show=function(){
  const result=previousShow.apply(this,arguments);
  page=currentPage();
  applyContent();
  return result;
 };
}
refreshPublic();
})();
