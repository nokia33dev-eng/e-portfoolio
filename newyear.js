/* Reversible New Year 2027 decorations. Remove this script and newyear.css to restore the original site. */
(function(){
  'use strict';
  const key='eportfoolio-newyear-theme';
  let stored='on';
  try { stored=window.localStorage.getItem(key)||'on'; } catch(e){}
  function enabled(){return document.body.classList.contains('ny-theme')}
  if(stored!=='off')document.body.classList.add('ny-theme');
  const button=document.createElement('button');
  button.type='button';
  button.className='ny-switch';
  button.setAttribute('aria-label','Vaheta uusaasta kujundust');
  function label(){button.textContent=enabled()?'🎄 Tavaline kujundus':'❄ Uusaasta kujundus';button.setAttribute('aria-pressed',String(enabled()))}
  label();
  button.addEventListener('click',function(){
    document.body.classList.toggle('ny-theme');
    try{window.localStorage.setItem(key,enabled()?'on':'off')}catch(e){}
    label();
  });
  document.body.appendChild(button);
  const snow=document.createElement('div');
  snow.className='ny-snow';
  snow.setAttribute('aria-hidden','true');
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce){
    const glyph=['❄','✧','❅','•'];
    for(let i=0;i<32;i++){
      const flake=document.createElement('span');
      flake.className='ny-flake';
      flake.textContent=glyph[i%glyph.length];
      flake.style.setProperty('--x',((i*37+9)%100)+'%');
      flake.style.setProperty('--size',(9+(i*3)%13)+'px');
      flake.style.setProperty('--speed',(10+(i*7)%13)+'s');
      flake.style.setProperty('--delay',(-((i*5)%21))+'s');
      flake.style.setProperty('--drift',(-56+(i*29)%120)+'px');
      snow.appendChild(flake);
    }
  }
  document.body.appendChild(snow);
  const tree=document.createElement('div');
  tree.className='ny-tree';
  tree.setAttribute('aria-hidden','true');
  tree.textContent='🎄';
  document.body.appendChild(tree);
  function decorateHome(){
    const hero=document.querySelector('#content .hero.hero-butchery');
    if(!hero)return;
    if(!hero.querySelector('.ny-garland')){
      const garland=document.createElement('div');
      garland.className='ny-garland';
      garland.setAttribute('aria-hidden','true');
      garland.innerHTML='<svg viewBox="0 0 1200 125" preserveAspectRatio="none"><path d="M-10 5 Q140 152 300 5 Q450 152 600 5 Q750 152 900 5 Q1050 152 1210 5" fill="none" stroke="#d2ba7e" stroke-width="2.4" opacity=".68"/></svg>';
      const colors=['#ff6b7a','#ffe18b','#5ce8a1','#8fdafa'];
      for(let i=0;i<20;i++){
        const light=document.createElement('i');
        light.className='ny-light';
        light.style.setProperty('--left',(i*5+1.6)+'%');
        light.style.setProperty('--top',(19+Math.abs(Math.sin(i*Math.PI/5))*42)+'px');
        light.style.setProperty('--color',colors[i%4]);
        light.style.setProperty('--delay',((i%6)*-.4)+'s');
        garland.appendChild(light);
      }
      hero.appendChild(garland);
    }
    const content=hero.querySelector('.hero-content');
    if(content&&!content.querySelector('.ny-welcome')){
      const badge=document.createElement('div');
      badge.className='ny-welcome';
      badge.textContent='Häid jõule ja head uut aastat 2027!';
      content.prepend(badge);
    }
    ensureCountdown(content);
  }

  // Real-time countdown to 1 Jan 2027, midnight in Estonia (UTC+2 in winter).
  const midnight2027=new Date('2027-01-01T00:00:00+02:00').getTime();
  function ensureCountdown(heroContent){
    if(!heroContent || heroContent.querySelector('.ny-countdown'))return;
    const panel=document.createElement('section');
    panel.className='ny-countdown';
    panel.setAttribute('aria-label','Aega uue aastani');
    panel.innerHTML=
      '<div class="ny-countdown-kicker"><span class="ny-countdown-star" aria-hidden="true">✦</span> UUE AASTANI ON JÄÄNUD <span class="ny-countdown-star" aria-hidden="true">✦</span></div>'+
      '<div class="ny-countdown-grid" role="timer" aria-label="Aega uue aastani">'+
      '<div class="ny-time-unit"><strong data-ny-unit="days">00</strong><span>Päeva</span></div>'+
      '<div class="ny-time-unit"><strong data-ny-unit="hours">00</strong><span>Tundi</span></div>'+
      '<div class="ny-time-unit"><strong data-ny-unit="minutes">00</strong><span>Minutit</span></div>'+
      '<div class="ny-time-unit"><strong data-ny-unit="seconds">00</strong><span>Sekundit</span></div>'+
      '</div><p class="ny-countdown-zone">1. jaanuar 2027 · 00:00 · Eesti aeg 🇪🇪</p>';
    const after=heroContent.querySelector('.hero-subtitle');
    if(after)after.insertAdjacentElement('afterend',panel);
    else heroContent.appendChild(panel);
    updateCountdown();
  }
  function updateCountdown(){
    const panel=document.querySelector('#content .ny-countdown');
    if(!panel)return;
    const diff=Math.max(0,midnight2027-Date.now());
    const totalSeconds=Math.ceil(diff/1000);
    const vals={
      days:Math.floor(totalSeconds/86400),
      hours:Math.floor(totalSeconds%86400/3600),
      minutes:Math.floor(totalSeconds%3600/60),
      seconds:totalSeconds%60
    };
    Object.keys(vals).forEach(name=>{
      const target=panel.querySelector('[data-ny-unit="'+name+'"]');
      const display=String(vals[name]).padStart(2,'0');
      if(target&&target.textContent!==display)target.textContent=display;
    });
    if(diff===0&&!panel.classList.contains('ny-finished')){
      panel.classList.add('ny-finished');
      panel.querySelector('.ny-countdown-kicker').textContent='🎆 HEAD UUT AASTAT 2027! 🎆';
      panel.querySelector('.ny-countdown-zone').textContent='Õnne ja rõõmu uuel aastal!';
    }
  }
  setInterval(updateCountdown,1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateCountdown()});
  decorateHome();
  const content=document.getElementById('content');
  if(content&&'MutationObserver' in window){
    const observer=new MutationObserver(decorateHome);
    observer.observe(content,{childList:true,subtree:false});
  }
})();