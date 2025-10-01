// Typing animation
const typingEl = document.getElementById("typing-name");

const textArray = [
  "My name is ",
  { text: "Sasha", class: "highlight" },
  "<3"
];

let outerIndex = 0;
let innerIndex = 0;

function type() {
  if (outerIndex >= textArray.length) {
    const cursor = document.getElementById('typing-cursor');
    if (cursor) cursor.style.display = 'none';
    startFrameAnimation();
    return;
  }

  const current = textArray[outerIndex];

  if (typeof current === "string") {
    typingEl.appendChild(document.createTextNode(current[innerIndex]));
    innerIndex++;
    if (innerIndex >= current.length) {
      outerIndex++;
      innerIndex = 0;
    }
    setTimeout(type, 120);
  } else if (typeof current === "object") {
    if (innerIndex === 0) {
      const span = document.createElement("span");
      span.className = current.class;
      span.id = "temp-span";
      typingEl.appendChild(span);
    }
    const spanEl = document.getElementById("temp-span");
    spanEl.textContent += current.text[innerIndex];
    innerIndex++;
    if (innerIndex >= current.text.length) {
      outerIndex++;
      innerIndex = 0;
      spanEl.removeAttribute("id"); // keep span permanently
    }
    setTimeout(type, 120);
  }
}

type();


function startFrameAnimation(){
  heroWrap.classList.add('frame-drawn');
  setTimeout(()=> heroWrap.classList.add('frame-complete'), 760);
}

const aboutSection = document.getElementById('about');
const progressBars = aboutSection.querySelectorAll('.progress-bar-inner');

const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      progressBars.forEach(bar => {
        const percent = bar.dataset.percent || '100%';
        bar.style.width = percent; // set individual width
      });
      progressObserver.unobserve(aboutSection);
    }
  });
},{ threshold: 0.2 });

progressObserver.observe(aboutSection);

function animateProgress(subsection) {
  const bars = subsection.querySelectorAll('.progress-bar-inner');
  bars.forEach(bar => {
    bar.style.width = '0%'; // reset first
    setTimeout(() => {
      bar.style.width = bar.dataset.percent || '100%';
    }, 50); // slight delay to trigger transition
  });
}

// Listen for clicks on subsection buttons
document.querySelectorAll('.subsection-labels button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.show);
    animateProgress(target); // animate bars for the newly active subsection
  });
});

// Set year
document.getElementById('year').textContent = new Date().getFullYear();

// Fade-in sections
const fades = document.querySelectorAll('.fade-in');
const fio = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); }); },{threshold:0.08});
fades.forEach(f=>fio.observe(f));

// About toggles
document.querySelectorAll('.subsection-labels button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.subsection').forEach(s=>s.classList.remove('active'));
    document.getElementById(btn.dataset.show).classList.add('active');
    document.querySelectorAll('.subsection-labels button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

function updateSubsectionWrapperSize() {
  const wrapper = document.querySelector('.subsection-wrapper');
  if (!wrapper) return;
  const subsections = Array.from(wrapper.querySelectorAll('.subsection'));
  // measure natural heights: temporarily make each visible to measure
  let max = 0;
  subsections.forEach(s => {
    const prevVisibility = s.style.visibility;
    const prevDisplay = s.style.display;
    const prevPosition = s.style.position;
    // make measurable without affecting layout (use absolute but visible)
    s.style.position = 'absolute';
    s.style.visibility = 'visible';
    s.style.display = 'block';
    s.style.opacity = 1;
    const h = s.offsetHeight;
    if (h > max) max = h;
    // restore inline styles (we only changed inline style)
    s.style.visibility = prevVisibility;
    s.style.display = prevDisplay;
    s.style.position = prevPosition;
    s.style.opacity = '';
  });
  // apply min-height to the wrapper so the layout doesn't jump
  wrapper.style.minHeight = (max ? max + 'px' : '');
}

/* run on load */
window.addEventListener('load', updateSubsectionWrapperSize);
/* run on resize */
window.addEventListener('resize', () => {
  // small debounce
  clearTimeout(window._subWrapResizeTimer);
  window._subWrapResizeTimer = setTimeout(updateSubsectionWrapperSize, 120);
});

/* also call whenever you switch tabs (you already have click handlers) */
document.querySelectorAll('.subsection-labels button').forEach(btn => {
  btn.addEventListener('click', () => {
    // existing behaviour already toggles .active — if not, keep it
    // ensure wrapper height is recalculated after transition
    setTimeout(updateSubsectionWrapperSize, 320);
  });
});

/* initial call in case DOM already loaded */
updateSubsectionWrapperSize();

// Projects
const projects = [
  {title:'Task Manager CLI', desc:'Terminal task manager.', img:'assets/screenshots/task_manager.png', url:'https://github.com/retr0stack/task-manager-cli'},
  {title:'Mini Search Engine', desc:'Inverted index search engine.', img:'assets/screenshots/mini_search.png', url: 'https://github.com/retr0stack/mini-search'},
  {title:'Weather Event Telegram bot', desc:'Posts alerts to Telegram.', img:'assets/screenshots/weather_event_bot.png', url: 'https://github.com/retr0stack/weather-event-bot'},
  {title:'Weather App Tkinter', desc:'Desktop weather app.', img:'assets/screenshots/weather_app.png', url: 'https://github.com/retr0stack/weather-app'},
  {title:'Plagiarism Checker Web', desc:'Web text similarity checker.', img:'assets/screenshots/plagiarism_checker.png', url: 'https://github.com/retr0stack/plagiarism-checker-web'},
  {title:'Sudoku Solver UI', desc:'GUI Sudoku solver.', img:'assets/screenshots/sudoku_solver.png', url: 'https://github.com/retr0stack/sudoku-solver'}
];

const grid = document.getElementById('projects-grid');
projects.forEach((p, idx)=>{
  const el=document.createElement('article');
  el.className='plate';
  el.dataset.index=idx;
  el.innerHTML = `
  <div>
    <div class="meta"><h4>${p.title}</h4></div>
    <p>${p.desc}</p>
    <img src="${p.img}" alt="${p.title} screenshot" class="project-photo">
    <div class="plate-actions">
      <button class="view-btn" data-url="${p.url}" aria-label="Open ${p.title}">Open</button>
      <button class="screenshot-btn" aria-label="Toggle screenshot for ${p.title}">Toggle Photo</button>
    </div>
  </div>
`;
  grid.appendChild(el);
});

// Project reveal
const plates = Array.from(document.querySelectorAll('.plate'));
const io = new IntersectionObserver(entries=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      const idx = parseInt(ent.target.dataset.index || 0,10);
      setTimeout(()=>{
        ent.target.classList.add('show');
        const img = ent.target.querySelector('.project-photo');
        if(img) setTimeout(()=> img.classList.add('revealed'), 160);
      }, idx*150); // slightly slower to avoid overlap
      io.unobserve(ent.target);
    }
  });
},{threshold:0.12});
plates.forEach(p=>io.observe(p));

// Screenshot toggle
document.addEventListener('click', e=>{
  if(e.target.matches('.screenshot-btn')){
    const img = e.target.closest('.plate').querySelector('.project-photo');
    if(img) img.classList.toggle('revealed');
  }
});

// Open project demo
document.addEventListener('click', (e) => {
  if (e.target.matches('.view-btn')) {
    const url = e.target.dataset.url;
    if (url) window.open(url, '_blank'); // opens in new tab
  }
});

// Contact reveal
const contactObserver = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      document.querySelectorAll('#contact-card, #note-card').forEach(c=>{ c.classList.add('visible'); });
      contactObserver.unobserve(en.target);
    }
  });
},{threshold:0.14});
contactObserver.observe(document.getElementById('contact-grid'));

// Nav smooth scroll
document.querySelectorAll('nav a').forEach(a=>{
  a.addEventListener('click', ev=>{
    ev.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});

// Contact form demo
document.getElementById('contact-form').addEventListener('submit', e=>{
  e.preventDefault();
  alert('Thanks, '+document.getElementById('name').value+' — your message was applied.');
  e.target.reset();
});

// Modal
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalClose = modal.querySelector('.modal-close');
const overlay = modal.querySelector('.modal-overlay');

document.addEventListener('click', e => {
  if (e.target.matches('.screenshot-btn')) {
    const img = e.target.closest('.plate').querySelector('.project-photo');
    if (img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
});

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if(e.key==='Escape') closeModal(); });

function closeModal() { modal.style.display='none'; modalImg.src=''; document.body.style.overflow=''; }