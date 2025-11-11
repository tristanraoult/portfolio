// Année footer
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Radials (conic-gradient) — hard skills
document.querySelectorAll('.radial').forEach(el=>{
  const pct = Math.max(0, Math.min(100, parseInt(el.dataset.pct || '0',10)));
});

// Back to top visibility
const toTop = document.getElementById('toTop');
const toggleToTop = ()=> {
  if (window.scrollY > 600) toTop.classList.add('show');
  else toTop.classList.remove('show');
};
toggleToTop();
window.addEventListener('scroll', toggleToTop);
toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// Squiggle subtle motion
const squiggle = document.getElementById('squiggle');
let dash = 0;
function animateSquiggle(){
  dash = (dash + 0.6) % 18;
  if (squiggle) squiggle.setAttribute('stroke-dashoffset', dash.toString());
  requestAnimationFrame(animateSquiggle);
}
requestAnimationFrame(animateSquiggle);

// Optional: flash chips on hover (tiny micro-interaction)
document.querySelectorAll('.soft-chip,.chip').forEach(ch=>{
  ch.addEventListener('mouseenter', ()=> ch.style.borderColor = '#2e3033');
  ch.addEventListener('mouseleave', ()=> ch.style.borderColor = 'var(--line)');
});


/* ====== MODAL PROJETS ====== */
(function(){
  const modal = document.getElementById('workModal');
  if(!modal) return;
  const dlg   = modal.querySelector('.modal-dialog');
  const img   = modal.querySelector('#workImg');
  const title = modal.querySelector('#workTitle');
  const desc  = modal.querySelector('#workDesc');
  const link  = modal.querySelector('#workLink');

  function openModal(data){
    title.textContent = data.title || '';
    desc.textContent  = data.desc  || '';
    img.src           = data.img   || '';
    img.alt           = data.title || '';
    if (data.link){
      link.href = data.link; link.style.display = '';
    } else {
      link.style.display = 'none';
    }
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.classList.remove('show');
    document.body.style.overflow = '';
    // évite garder la dernière image en cache visuel si besoin
    setTimeout(()=>{ img.removeAttribute('src'); }, 250);
  }

  // open
  document.querySelectorAll('.card .open').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      openModal({
        title: btn.dataset.title,
        desc:  btn.dataset.desc,
        img:   btn.dataset.img,
        link:  btn.dataset.link
      });
    });
  });

  // close (fond, bouton, Esc)
  modal.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close')) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });
})();
/* ====== Modale "Télécharger le Portfolio" (PDF/MP4) ====== */
(function(){
  const btn   = document.getElementById('dlPortfolioBtn');
  const modal = document.getElementById('dlModal');
  if(!btn || !modal) return;

  const open  = ()=>{ modal.classList.add('show'); document.body.style.overflow='hidden'; };
  const close = ()=>{ modal.classList.remove('show'); document.body.style.overflow=''; };

  btn.addEventListener('click', open);
  modal.addEventListener('click', e=>{ if(e.target.hasAttribute('data-close')) close(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal.classList.contains('show')) close(); });
})();

// ===== Skills bars: animate on view + update aria
(function(){
  const items = document.querySelectorAll('.skill[data-pct]');
  if(!items.length) return;

  const animate = (el)=>{
    const pct = Math.max(0, Math.min(100, parseInt(el.dataset.pct||'0',10)));
    const fill = el.querySelector('.bar-fill');
    const bar  = el.querySelector('.bar');
    const num  = el.querySelector('.pct');
    if(!fill || !bar) return;

    // animation largeur
    requestAnimationFrame(()=>{ fill.style.width = pct + '%'; });

    // accessibilité
    bar.setAttribute('aria-valuenow', pct);

    // option : incrémentation du nombre (simple)
    let v = 0;
    const step = ()=>{
      v += Math.max(1, Math.round((pct - v) * 0.15));
      if(v > pct) v = pct;
      if(num) num.textContent = v + '%';
      if(v < pct) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); }
    });
  },{threshold:.35});

  items.forEach(el=> io.observe(el));
})();
