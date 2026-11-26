(()=>{
 const work=document.querySelector('.home-page .work');if(!work)return;
 const data=[
 {name:'remate',type:'B2C · Sports · iOS',role:'Senior Product Designer',title:'Find your game. Book your court.',about:'An iOS app for padel, tennis and pickleball players in Spain.',contribution:'I contributed to player research and designed game discovery, court booking, split payments and invitations, from concept to developer handoff.',result:'Games without group-chat logistics',outcome:'Skill matching, filling the roster and splitting costs in one flow. Handed off to development.'},
 {name:'CoPilot',type:'B2B · Cybersecurity · AI',role:'Product Designer',title:'AI-assisted vulnerability triage',about:'An enterprise tool that helps security analysts distinguish real vulnerabilities from false positives.',contribution:'I worked with analysts and the PM, designed the AI check setup, processing states and finding review, and prepared the product for development.',result:'≈60% less time spent triaging scans',outcome:'From 6–8 to 2–3 hours. Around two-thirds of findings closed without reviewing code. In production.'},
 {name:'NOVA',type:'B2C · iGaming · Mobile',role:'Product Designer',title:'From sign-up to the first game',about:'A UK iGaming onboarding flow that preserves the player’s original intent through mandatory identity checks.',contribution:'I designed the journey from registration to KYC, first deposit and game launch, including error recovery and saved progress.',result:'Return to the game without losing progress',outcome:'The chosen game stays with the player through sign-up and identity checks. Recovery paths for 11 edge cases. Metrics under NDA.'},
 {name:'Track 2.0',type:'B2B · Cybersecurity · SaaS',role:'Product Designer',title:'From dashboards to decisions',about:'A redesign concept for an enterprise security dashboard, focused on what needs to be fixed first.',contribution:'I audited the existing dashboards and designed role-based templates, shared filters, widget configuration and the path from charts to actionable details.',result:'A dashboard in 10 seconds, not a minute',outcome:'Redesign concept target: role-based templates and one click to priority vulnerabilities. Not measured in production.'}
 ];
 const mk=(tag,cl,txt)=>{const el=document.createElement(tag);if(cl)el.className=cl;if(txt)el.textContent=txt;return el};
 const h=work.querySelector('h2');h.textContent='Selected work';
 const header=mk('div','split-heading');header.append(h,mk('span','split-count','2024–2026 / 04'));work.prepend(header);
 [...work.querySelectorAll('.case-card')].forEach((card,i)=>{
 const d=data[i],old=card.querySelector('.case-copy'),image=card.querySelector(':scope > .case-cover, :scope > .case-texture-frame'),logo=old.querySelector('.case-logo').cloneNode(true);
 const body=mk('span','split-info'),brand=mk('span','split-brand');logo.classList.add('split-logo');logo.loading='eager';brand.append(logo,mk('span','split-name',d.name));
 const top=mk('span','split-top');top.append(brand,mk('span','split-index',String(i+1).padStart(2,'0')));
 const details=mk('span','split-details');details.append(mk('span','split-title',d.title),mk('span','split-about',d.about));
 const contribution=mk('span','split-contribution');contribution.append(mk('span','split-subhead','My contribution'),mk('span','split-about',d.contribution));
 const bottom=mk('span','split-bottom');bottom.append(mk('span','split-result',d.result),mk('span','split-outcome',d.outcome));
 body.append(top,mk('span','split-meta',d.type+' · '+d.role),details,contribution,bottom);
 old.replaceWith(body);card.prepend(body);
 if(image)image.classList.add('split-visual');
 const v=card.querySelector('video');if(v){
   v.removeAttribute('autoplay');v.pause();
   const still=document.createElement('img');still.className='split-poster';still.alt='';still.setAttribute('aria-hidden','true');
   const sync=()=>{if(v.poster&&still.src!==v.poster)still.src=v.poster;};
   sync();new MutationObserver(sync).observe(v,{attributes:true,attributeFilter:['poster']});image.append(still);
   if(new URLSearchParams(location.search).get('cases')==='classic'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
     let hovering=false;
     image.addEventListener('pointerenter',()=>{hovering=true;v.play().then(()=>{if(hovering)still.classList.add('playing');}).catch(()=>{});});
     image.addEventListener('pointerleave',()=>{hovering=false;still.classList.remove('playing');v.pause();});
   }
 }
 // Only the outermost frame owns the animated chrome rim.
 if(image)image.querySelectorAll('.portfolio-beam').forEach(b=>{if(b.parentElement!==image)b.remove()});

 });
})();
/* The original lightbox remains active; turn the gallery into a keyboard-accessible masonry collection. */
(()=>{
 const work=document.querySelector('#cases-panel'), concepts=document.querySelector('#concepts-panel');
 if(!work||!concepts)return;
 work.hidden=false;concepts.hidden=false;
 document.querySelectorAll('.concept-marquee-band video').forEach(v=>{v.pause();v.removeAttribute('autoplay');});
 const gallery=concepts.querySelector('.concepts-grid');
 if(!gallery)return;
 gallery.querySelectorAll('.concept-card').forEach(card=>{
   const media=card.querySelector('img,video');
   if(!media)return;
   card.tabIndex=0;card.setAttribute('role','button');
   card.setAttribute('aria-label',media.alt||media.getAttribute('aria-label')||'Open concept');
   card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();media.click();}});
   if(media.tagName==='VIDEO'&&media.dataset.video&&!media.getAttribute('src')){
      // Preserve the poster; existing media/lightbox code handles playback.
      media.preload='none';
   }
 });
})();
/* Editorial scatter: an aspect-ratio-aware skyline layout, with an adaptive small-screen fallback. */
(()=>{
 const grid=document.querySelector('.concepts-grid');if(!grid)return;
 const cards=[...grid.querySelectorAll('.concept-card')];
 const classic=new URLSearchParams(location.search).get('gallery')==='classic';
 if(!classic)grid.classList.add('concept-scatter');
 cards.forEach(c=>{
  const m=c.querySelector('img,video');if(!m)return;
  const w=Number(m.getAttribute('width')),h=Number(m.getAttribute('height'));
  if(c.hasAttribute('data-large-screens')||c.dataset.palette==='wallet-lime'||w/h>=1.85)c.classList.add('concept-wide');
 });
 let frame=0,previous='';
 const layout=()=>{
  frame=0;const desktop=innerWidth>850&&!classic, gap=innerWidth<=520?10:innerWidth<=850?12:24;
  const sizes=cards.map(c=>Math.max(1,Math.ceil((c.getBoundingClientRect().height+gap)/4)));
  const signature=[desktop,innerWidth,...sizes].join(',');
  if(signature===previous)return;previous=signature;
  const heights=[0,12,24];
  cards.forEach((c,i)=>{
   c.style.setProperty('--masonry-rows',sizes[i]);
   if(!desktop){c.style.removeProperty('--scatter-col');c.style.removeProperty('--scatter-row');return;}
   const span=c.classList.contains('concept-wide')?2:1;
   let col=0,top=Infinity;
   for(let j=0;j<=3-span;j++){
     const candidate=Math.max(...heights.slice(j,j+span));
     if(candidate<top){top=candidate;col=j;}
   }
   c.style.setProperty('--scatter-col',(col+1)+' / span '+span);
   c.style.setProperty('--scatter-row',(top+1)+' / span '+sizes[i]);
   for(let j=col;j<col+span;j++)heights[j]=top+sizes[i];
  });
 };
 const request=()=>{if(!frame)frame=requestAnimationFrame(layout)};
 const observer=new ResizeObserver(request);cards.forEach(c=>observer.observe(c));observer.observe(grid);
 window.addEventListener('resize',request,{passive:true});request();
 if(classic)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width:851px) and (pointer:fine)');
 const visible=new Set();
 let scrollFrame=0;
 function drift(){
   scrollFrame=0;
   const enabled=desktop.matches&&!motion.matches;
   visible.forEach(c=>{
    const m=c.querySelector('img,video');if(!m)return;
    const r=c.getBoundingClientRect(),center=r.top+r.height/2;
    const factor=Number(c.dataset.drift||1);
    const dy=enabled?Math.max(-7,Math.min(7,(center-innerHeight/2)*.014))*factor:0;
    m.style.setProperty('--art-drift',dy.toFixed(2)+'px');
   });
 }
 function schedule(){if(!scrollFrame)scrollFrame=requestAnimationFrame(drift)}
 const io=new IntersectionObserver(entries=>{
   entries.forEach(e=>{
    const c=e.target;
    if(e.isIntersecting){visible.add(c);if(!c.classList.contains('art-entered'))c.classList.add('art-entered');}
    else{visible.delete(c);c.querySelector('img,video')?.style.setProperty('--art-drift','0px');}
   });schedule();
 },{threshold:0.12});
 cards.forEach((c,i)=>{c.dataset.drift=String([1,-.75,.5][i%3]);c.style.setProperty('--art-delay',(i%3)*45+'ms');io.observe(c)});
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});motion.addEventListener('change',schedule);
})();
 
/* Morph the existing dock, never clone contact actions or the metallic border. */
(()=>{
 const anchor=document.querySelector('.intro > .contact-dock-anchor'), nav=anchor?.querySelector('.contact-dock');
 if(!nav)return;
 const content=document.createElement('div');content.className='morph-items';
 content.append(...nav.children);nav.append(content);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='morph-trigger';toggle.setAttribute('aria-label','Show contacts');toggle.setAttribute('aria-expanded','false');
 toggle.innerHTML='<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5.5" width="21" height="17" rx="4"/><circle cx="10" cy="12" r="2.5"/><path d="M6.5 19c.2-2.4 1.6-3.7 3.5-3.7s3.3 1.3 3.5 3.7M16.5 11.5h4M16.5 16.5h4"/></svg>';
 nav.append(toggle);anchor.classList.add('morph-dock');
 const footer=document.querySelector('.site-footer');
 let side=false,open=false,nearFooter=false,closeTimer=0,scheduled=false;
 const hover=matchMedia('(hover:hover) and (pointer:fine)');
 function render(){
  anchor.classList.toggle('is-side',side);anchor.classList.toggle('is-open',side&&open);
  anchor.classList.toggle('is-footer-hidden',nearFooter);
  if(nearFooter&&anchor.contains(document.activeElement))document.activeElement.blur();
  anchor.inert=nearFooter;anchor.setAttribute('aria-hidden',String(nearFooter));
  content.inert=nearFooter||(side&&!open);toggle.tabIndex=side&&!open&&!nearFooter?0:-1;toggle.setAttribute('aria-expanded',String(side&&open&&!nearFooter));
 }
 function setOpen(v){clearTimeout(closeTimer);open=v&&!nearFooter;render();}
 function scroll(){scheduled=false;const y=scrollY,next=side?y>20:y>64;const ft=footer?.getBoundingClientRect().top??Infinity;const hide=next&&ft<innerHeight+(nearFooter?48:0);if(next!==side||hide!==nearFooter){side=next;nearFooter=hide;open=false;clearTimeout(closeTimer);render()}}
 function requestScroll(){if(!scheduled){scheduled=true;requestAnimationFrame(scroll)}}
 window.addEventListener('scroll',requestScroll,{passive:true});
 window.addEventListener('resize',requestScroll,{passive:true});
 anchor.addEventListener('pointerenter',e=>{if(side&&hover.matches&&e.pointerType==='mouse')setOpen(true)});
 anchor.addEventListener('pointerleave',()=>{if(side&&hover.matches){closeTimer=setTimeout(()=>{if(!anchor.contains(document.activeElement))setOpen(false)},180)}});
 toggle.addEventListener('click',()=>{if(side){setOpen(true);content.querySelector('a,button')?.focus({preventScroll:true})}});
 anchor.addEventListener('focusout',e=>{if(side&&!anchor.contains(e.relatedTarget)&&!anchor.matches(':hover'))setOpen(false)});
 document.addEventListener('pointerdown',e=>{if(side&&open&&!anchor.contains(e.target))setOpen(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&side&&open){setOpen(false);toggle.focus({preventScroll:true})}});
 render();scroll();
})();

/* V18: intentional hover, independent of scrolling and stable row geometry. */
(()=>{
 const mode=new URLSearchParams(location.search).get('cases')||'open';
 if(mode==='classic')return;
 const root=document.documentElement;root.dataset.caseLayout='reveal';
 if(mode!=='reveal')root.dataset.casePresentation='open';
 const fine=matchMedia('(min-width:851px) and (hover:hover) and (pointer:fine)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const work=document.querySelector('.work');const cards=[...work.querySelectorAll('.case-card')];
 let active=null, pending=null, intentTimer=0, settleTimer=0, scrolling=false, pointer=null;
 function cancelIntent(){clearTimeout(intentTimer);pending=null;}
 function media(card,on){
  const v=card?.querySelector('video'),poster=card?.querySelector('.split-poster');if(!v)return;
  if(on&&!reduced.matches){v.play().then(()=>{if(active===card)poster?.classList.add('playing');else v.pause()}).catch(()=>{});}
  else{poster?.classList.remove('playing');v.pause();}
 }
 function activate(card){
  if(active===card)return;
  if(active){active.classList.remove('is-revealed');media(active,false);}
  active=card;
  if(card){card.classList.add('is-revealed');media(card,true);}
 }
 function target(){
  if(!pointer||!fine.matches)return null;
  const e=document.elementFromPoint(pointer.x,pointer.y);
  if(!e)return null;
  const c=e.closest('.work .case-card');
  return c&&(root.dataset.casePresentation==='open'||c===active||e.closest('.split-visual'))?c:null;
 }
 function consider(){
  if(scrolling||!fine.matches){cancelIntent();return;}
  const c=target();
  if(c===active){cancelIntent();return;}
  if(c===pending&&c)return;
  cancelIntent();
  if(!c){if(!active?.matches(':focus-visible'))activate(null);return;}
  pending=c;
  intentTimer=setTimeout(()=>{const next=pending;pending=null;if(!scrolling&&target()===next)activate(next);},140);
 }
 function markScroll(){
  if(!fine.matches)return;
  clearTimeout(settleTimer);cancelIntent();
  if(!scrolling){scrolling=true;root.classList.add('case-scroll-active');if(!active?.matches(':focus-visible'))activate(null);}
  settleTimer=setTimeout(()=>{scrolling=false;root.classList.remove('case-scroll-active');},190);
 }
 window.addEventListener('wheel',markScroll,{passive:true});
 window.addEventListener('scroll',markScroll,{passive:true});
 window.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pointer={x:e.clientX,y:e.clientY};consider();}},{passive:true});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget){pointer=null;cancelIntent();if(!active?.matches(':focus-visible'))activate(null);}});
 cards.forEach(card=>{
  const rim=document.createElement('span');rim.className='project-rim liquid-metal-border';rim.setAttribute('aria-hidden','true');card.append(rim);
  card.addEventListener('focus',()=>{if(card.matches(':focus-visible')){cancelIntent();activate(card);}});
  card.addEventListener('blur',()=>{if(active===card){activate(null);consider();}});
 });
 fine.addEventListener('change',()=>{clearTimeout(settleTimer);scrolling=false;root.classList.remove('case-scroll-active');cancelIntent();activate(null);});
 reduced.addEventListener('change',()=>{if(active&&reduced.matches)media(active,false);});
})();
 
/* V12: ordinary portrait only. Remove the pixel-photo target before deferred
   pixels.js initializes, leaving its unrelated cursor behavior intact. */
(()=>{
 const wrap=document.querySelector('.intro-photo-wrap');
 if(!wrap)return;
 const real=wrap.querySelector('.intro-photo-real')||wrap.querySelector('.intro-photo--pixel');
 if(!real)return;
 real.className='intro-photo-static';
 real.removeAttribute('data-pixel-mask');real.removeAttribute('aria-hidden');
 real.alt='Anna Demeshko';real.loading='eager';
 wrap.replaceChildren(real);
 document.querySelectorAll('.pixel-photo').forEach(c=>c.remove());
})();

/* Mobile captions are visual only; preserve accessible action names. */
(()=>{
 document.querySelectorAll('.contact-dock .dock-item').forEach(item=>{
  if(item.hasAttribute('aria-label'))return;
  const label=item.querySelector('.dock-label [data-lang="en"]')?.textContent?.trim()||item.querySelector('.dock-label')?.textContent?.trim();
  if(label)item.setAttribute('aria-label',label);
 });
})();

/* Reorder original buttons, without replacing theme-switch event handlers. */
(()=>{
 const group=document.querySelector('.theme-switch');if(!group)return;
 for(const name of ['light','pink','dark']){
  const button=group.querySelector('[data-theme-set="'+name+'"]');
  if(!button)continue;
  button.textContent='';button.removeAttribute('title');group.append(button);
 }
})();

/* Reuse the original theme dock buttons and the portfolio metal-rim skill. */
(()=>{
 const group=document.querySelector('.theme-switch');if(!group)return;
 group.classList.add('liquid-metal-border','liquid-metal-border--hover');
 for(const button of group.querySelectorAll('.theme-btn')){
  const check=document.createElementNS('http://www.w3.org/2000/svg','svg');
  check.setAttribute('class','swatch-check');check.setAttribute('viewBox','0 0 16 16');check.setAttribute('aria-hidden','true');
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d','M3.5 8l3 3 6-6');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','2');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');
  check.append(path);button.append(check);
 }
})();
