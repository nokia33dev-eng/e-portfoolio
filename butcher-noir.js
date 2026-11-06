
/* Theme behavior: original course navigation and learning content remain intact. */
(function(){
const svg=(p)=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">'+p+'</svg>';
const icon={
home:svg('<path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3z"/>'),
user:svg('<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2z"/>'),
briefcase:svg('<rect x="2" y="7" width="20" height="15" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13c6 3 14 3 20 0"/>'),
star:svg('<path d="m12 2 3.15 6.4 7.07 1.03-5.11 4.98 1.2 7.04L12 18.13l-6.31 3.32 1.2-7.04-5.1-4.98 7.06-1.03z"/>'),
mail:svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>'),
meat:svg('<path d="M8 3C3 4 2 9 3 13s4 8 10 8 9-3 9-8c0-4-3-6-6-7S12 2 8 3z"/><path d="M10 8c-2.5 0-4 2-4 4s2 4 4.5 4c3 0 4.5-2 4.5-4s-2-4-5-4z"/>'),
tools:svg('<path d="m4 3 16 18M20 3 4 21M5 3 3 5l4 4 2-2m6 10 2-2 4 4-2 2m1-17 2 2-4 4-2-2M3 20l-1 2"/>'),
shield:svg('<path d="M12 2 21 6v6c0 5-3 8-9 10-6-2-9-5-9-10V6z"/><path d="m8 12 3 3 5-6"/>')
};
const blades='<img src="./crossed-knives.svg?v=20261106-new-logo" alt="" draggable="false" loading="eager">';
const oldHeader=document.querySelector('header');
oldHeader.outerHTML='<header class="new-header"><div class="site-brand" id="brandHome" role="button" tabindex="0" aria-label="Avaleht"><span class="brand-symbol">'+blades+'</span><span><strong>Oleksandr Nadiein</strong><small>Lihameister</small></span></div><nav class="site-links" aria-label="Peamenüü"><button type="button" data-top="Home">'+icon.home+'Avaleht</button><button type="button" data-top="Minust">'+icon.user+'Minust</button><button type="button" data-top="Portfoolio">'+icon.briefcase+'Portfoolio</button><button type="button" data-top="Oskused">'+icon.star+'Oskused</button><button type="button" data-top="Kontakt">'+icon.mail+'Kontakt</button></nav><button class="menu-toggle" id="toggle" aria-label="Ava menüü" type="button">☰ Menüü</button></header>';
document.querySelector('.layout').insertAdjacentHTML('beforebegin','<div class="nav-backdrop" id="navBackdrop"></div>');
const hero='<section class="hero hero-butchery"><div class="hero-scene" aria-hidden="true"><div class="hero-photo hero-photo-left"></div><div class="hero-photo hero-photo-bull"></div><div class="hero-photo hero-photo-steak"></div></div><div class="hero-content"><div class="hero-blades">'+blades+'</div><h1>E-PORTFOOLIO</h1><div class="neon-divider"><i></i></div><h2>Oleksandr Nadiein</h2><div class="hero-id">LTO26</div><div class="profession-sign">'+icon.tools+'<span>LIHAMEISTER</span></div><p class="hero-subtitle">Lihatöötleja</p><div class="hero-quicklinks"><button data-go="Liha tehnoloogia">'+icon.meat+'<span>Lihatöötlemine</span></button><button data-go="Lihatöötlemise praktika">'+icon.tools+'<span>Tootmine</span></button><button data-go="Toiduohutus">'+icon.shield+'<span>Hügieen ja kvaliteet</span></button></div></div></section>';
home=function(){return hero+'<div class="home-bottom"><div class="home-kicker">Minu õpiteekond</div><h2 class="section-title">Õpingud ja praktilised tööd</h2><div class="features"><div class="card"><h3>🥩 Liha tehnoloogia</h3><p>Liha käitlemise ja lihatoodete valmistamise teemad.</p><button data-go="Liha tehnoloogia">Vaata teemasid →</button></div><div class="card"><h3>⚔ Lihatöötlemise praktika</h3><p>Praktilised tööd, kogemused ja õpitud oskused.</p><button data-go="Lihatöötlemise praktika">Vaata praktikat →</button></div><div class="card"><h3>🛡 Toiduohutus</h3><p>Hügieen, puhtus ja kvaliteedi tagamine.</p><button data-go="Toiduohutus">Vaata teemasid →</button></div></div><section style="margin-top:60px" id="about-home"><div class="home-kicker">Kes ma olen</div><h2 class="section-title">Minust</h2>'+about()+'</section><p style="font-size:12px;color:#877c82;margin-top:30px">Fotod: <a href="https://unsplash.com/photos/a-cutting-board-topped-with-raw-meat-next-to-a-knife-ZhGH7BX9bGY" target="_blank" rel="noopener noreferrer" style="color:#bd7e88">Sergey Kotenev</a> ja <a href="https://unsplash.com/photos/a-close-up-of-a-black-bull-with-large-horns-xU5Qkwy2Rz0" target="_blank" rel="noopener noreferrer" style="color:#bd7e88">Bob Brewer</a> / Unsplash</p></div>'};
function closeDrawer(){sidebar.classList.remove('open');document.body.classList.remove('portfolio-open')}
function toggleDrawer(){const opening=!sidebar.classList.contains('open');sidebar.classList.toggle('open',opening);document.body.classList.toggle('portfolio-open',opening)}
function extraPage(name){
if(name==='Minust')return '<section class="content-panel"><div class="crumb">AVALEHT / MINUST</div><h1 class="section-title">Minust</h1><p class="lead">Tere tulemast minu e-portfooliosse!</p>'+about()+'</section>';
if(name==='Oskused')return '<section class="content-panel"><div class="crumb">AVALEHT / OSKUSED</div><h1 class="section-title">Oskused ja õpingud</h1><p class="lead">Peamised erialased valdkonnad, mida õpin.</p><div class="cards"><div class="card"><h3>🥩 Liha tehnoloogia</h3><p>Liha käitlemine ja valmistamine.</p><button data-go="Liha tehnoloogia">Vaata →</button></div><div class="card"><h3>🛡 Toiduohutus</h3><p>Hügieen, kvaliteet ja puhastus.</p><button data-go="Toiduohutus">Vaata →</button></div><div class="card"><h3>⚔ Praktika</h3><p>Praktilised tööd ja praktikaseminarid.</p><button data-go="Lihatöötlemise praktika">Vaata →</button></div></div></section>';
if(name==='Kontakt')return '<section class="content-panel"><div class="crumb">AVALEHT / KONTAKT</div><h1 class="section-title">Kontakt</h1><p class="lead">Oleksandr Nadiein · LTO26 · Lihameister</p><div class="portfolio-note">See on minu õppeportfoolio. Vaata minu õpitöid ja praktikat portfoolio menüü kaudu.</div><p style="margin-top:30px"><button class="back" data-go="Home">← Avaleht</button></p></section>';
return '';
}
const originalShow=show;
show=function(name){
closeDrawer();
if(['Minust','Oskused','Kontakt'].includes(name)){
current=name;renderNav();content.innerHTML=extraPage(name);
content.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.go)));
window.scrollTo(0,0);
}else originalShow(name);
const selected=['Home','Minust','Oskused','Kontakt'].includes(name)?name:'Portfoolio';
document.querySelectorAll('.site-links button[data-top]').forEach(b=>{b.classList.toggle('active',b.dataset.top===selected);if(b.dataset.top===selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
};
document.getElementById('toggle').onclick=toggleDrawer;
document.getElementById('navBackdrop').onclick=closeDrawer;
document.getElementById('brandHome').onclick=()=>show('Home');
document.getElementById('brandHome').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show('Home')}};
document.querySelectorAll('.site-links button[data-top]').forEach(b=>b.onclick=()=>b.dataset.top==='Portfoolio'?toggleDrawer():show(b.dataset.top));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});

/* Interactive motion v2: embers, sparkles, spotlight and scroll entrance */
const showWithTheme=show;
function decorateMotion(){
  const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero=content.querySelector('.hero.hero-butchery');
  if(hero&&!reduce){
    const embers=document.createElement('div');embers.className='fx-embers';embers.setAttribute('aria-hidden','true');
    for(let i=0;i<23;i++){
      const e=document.createElement('i');e.className='fx-ember';
      e.style.setProperty('--x',((i*37+13)%100)+'%');
      e.style.setProperty('--size',(2+(i*3)%5)+'px');
      e.style.setProperty('--duration',(5+(i*7)%8)+'s');
      e.style.setProperty('--delay',(-((i*11)%14))+'s');
      e.style.setProperty('--drift',(-75+(i*29)%150)+'px');
      embers.appendChild(e);
    }
    const stars=document.createElement('div');stars.className='fx-stars';stars.setAttribute('aria-hidden','true');
    for(let i=0;i<23;i++){
      const e=document.createElement('i');e.className='fx-star';
      e.style.setProperty('--x',((i*41+9)%100)+'%');
      e.style.setProperty('--y',((i*29+7)%86)+'%');
      e.style.setProperty('--duration',(2+(i%5))+'s');
      e.style.setProperty('--delay',(-((i*13)%9))+'s');
      stars.appendChild(e);
    }
    const spot=document.createElement('div');spot.className='fx-light';spot.setAttribute('aria-hidden','true');
    hero.appendChild(embers,stars,spot);
    if(window.matchMedia('(pointer:fine)').matches){
      hero.addEventListener('pointermove',function(event){
        const rect=hero.getBoundingClientRect();
        hero.style.setProperty('--spot-x',((event.clientX-rect.left)/rect.width*100).toFixed(1)+'%');
        hero.style.setProperty('--spot-y',((event.clientY-rect.top)/rect.height*100).toFixed(1)+'%');
      },{passive:true});
      hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--spot-x','50%');hero.style.setProperty('--spot-y','43%')});
    }
  }
  if(reduce)return;
  const revealNodes=content.querySelectorAll('.home-bottom .card,.home-bottom .section-title,.home-bottom .home-kicker,.home-bottom .personal-about,.content-panel .card,.content-panel .section-title');
  const observer='IntersectionObserver' in window?new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('fx-shown');obs.unobserve(entry.target)}});
  },{threshold:.05,rootMargin:'0px 0px 65px 0px'}):null;
  revealNodes.forEach((el,i)=>{
    el.classList.add('fx-reveal');
    if(el.classList.contains('card'))el.classList.add('fx-stagger');
    if(!observer||el.getBoundingClientRect().top<window.innerHeight-40){el.classList.add('fx-shown')}
    else observer.observe(el);
  });
}
show=function(name){showWithTheme(name);decorateMotion()};

show('Home');
})();
