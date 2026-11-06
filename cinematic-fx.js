/* E-Portfoolio: optional cinematic effects (embers, cursor, chrome, orbit, card glints). */
(function(){
  'use strict';
  const storageKey='eportfoolio-cinematic-effects';
  const reduced=!!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const finePointer=!!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);
  const content=document.getElementById('content');
  let saved='on';
  try{saved=window.localStorage.getItem(storageKey)||'on'}catch(e){}
  let active=saved!=='off';

  /* The home page is replaced during navigation. Keep the ring and text
     highlight attached to the latest hero, without duplicating nodes. */
  function enhanceHero(){
    if(!content)return;
    const hero=content.querySelector('.hero.hero-butchery');
    if(!hero)return;
    const blades=hero.querySelector('.hero-blades');
    if(blades&&!blades.querySelector('.cinematic-orbit')){
      const orbit=document.createElement('span');
      orbit.className='cinematic-orbit';
      orbit.setAttribute('aria-hidden','true');
      const inner=document.createElement('span');
      inner.className='cinematic-orbit-inner';
      inner.setAttribute('aria-hidden','true');
      blades.appendChild(orbit,inner);
    }
    const title=hero.querySelector('h1');
    if(title&&!title.hasAttribute('data-cinematic-title')){
      title.setAttribute('data-cinematic-title',title.textContent.trim());
    }
  }

  /* Global sparks complement the small embers already present in the hero;
     they are deliberately lightweight and never intercept mouse events. */
  if(!reduced){
    const embers=document.createElement('div');
    embers.className='cinematic-embers';
    embers.setAttribute('aria-hidden','true');
    for(let i=0;i<22;i++){
      const e=document.createElement('i');
      e.className='cinematic-ember'+(i%5===0?' gold':'');
      e.style.setProperty('--left',((i*37+11)%97+1)+'%');
      e.style.setProperty('--size',(2+(i*3)%4)+'px');
      e.style.setProperty('--duration',(8+(i*7)%9)+'s');
      e.style.setProperty('--delay',(-((i*13)%19))+'s');
      e.style.setProperty('--drift',(-96+(i*39)%192)+'px');
      embers.appendChild(e);
    }
    document.body.appendChild(embers);
  }

  /* A single mouse light; throttle position painting to one animation frame.
     Touchscreens and reduced-motion users do not get a mouse trail. */
  let cursor=null;
  if(!reduced&&finePointer){
    cursor=document.createElement('div');
    cursor.className='cinematic-cursor';
    cursor.setAttribute('aria-hidden','true');
    document.body.appendChild(cursor);
    let frame=0,x=0,y=0;
    window.addEventListener('pointermove',function(event){
      if(!active||event.pointerType==='touch')return;
      x=event.clientX;
      y=event.clientY;
      if(frame)return;
      frame=window.requestAnimationFrame(function(){
        cursor.style.left=x+'px';
        cursor.style.top=y+'px';
        cursor.classList.add('is-visible');
        frame=0;
      });
    },{passive:true});
    window.addEventListener('blur',function(){cursor.classList.remove('is-visible')});
    document.addEventListener('mouseleave',function(){cursor.classList.remove('is-visible')});
    document.addEventListener('visibilitychange',function(){if(document.hidden)cursor.classList.remove('is-visible')});
  }

  /* Make all five new effects reversible without affecting course content,
     existing New Year theme, timer, or the meat-cutting knife animation. */
  const toggle=document.createElement('button');
  toggle.type='button';
  toggle.className='cinematic-toggle';
  toggle.setAttribute('aria-label','Lülita kinematograafilised efektid sisse või välja');
  function applyState(){
    document.body.classList.toggle('cinematic-effects-off',!active);
    toggle.setAttribute('aria-pressed',String(active));
    toggle.textContent=active?'✨ Efektid: SEES':'✨ Efektid: VÄLJAS';
    if(!active&&cursor)cursor.classList.remove('is-visible');
  }
  toggle.addEventListener('click',function(){
    active=!active;
    try{window.localStorage.setItem(storageKey,active?'on':'off')}catch(e){}
    applyState();
  });
  document.body.appendChild(toggle);
  applyState();
  enhanceHero();
  if(content&&'MutationObserver' in window){
    const observer=new MutationObserver(enhanceHero);
    observer.observe(content,{childList:true,subtree:false});
  }
})();