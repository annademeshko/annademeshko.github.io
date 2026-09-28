(function(){
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveal=document.querySelectorAll(".nova-reveal");
  if(reduced||!("IntersectionObserver" in window)){reveal.forEach(el=>el.classList.add("is-visible"));}
  else{const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");io.unobserve(entry.target);}})},{threshold:.16});reveal.forEach(el=>io.observe(el));}

  const images=document.querySelectorAll('.nova-case img[src*="/nova/"],.nova-case img[src*="../assets/nova/"]');
  if(!images.length)return;
  const overlay=document.createElement("div");overlay.className="nova-lightbox";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-hidden","true");
  const close=document.createElement("button");close.className="nova-lightbox__close";close.type="button";close.setAttribute("aria-label","Close full-screen image");close.textContent="×";
  const image=document.createElement("img");image.alt="";overlay.appendChild(close);overlay.appendChild(image);document.body.appendChild(overlay);
  const open=(src,alt)=>{image.src=src;image.alt=alt||"";overlay.classList.add("is-open");overlay.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";};
  const shut=()=>{overlay.classList.remove("is-open");overlay.setAttribute("aria-hidden","true");document.body.style.overflow="";};
  images.forEach(img=>{img.tabIndex=0;img.setAttribute("role","button");img.addEventListener("click",()=>open(img.currentSrc||img.src,img.alt));img.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open(img.currentSrc||img.src,img.alt);}});});
  close.addEventListener("click",shut);overlay.addEventListener("click",e=>{if(e.target===overlay)shut();});document.addEventListener("keydown",e=>{if(e.key==="Escape")shut();});
})();