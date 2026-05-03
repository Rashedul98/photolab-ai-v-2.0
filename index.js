/* ══════════════════════════════════════════════════════════
   1. NAVBAR  –  shadow on scroll + active-link tracking
══════════════════════════════════════════════════════════ */
const header   = document.querySelector('header');
const sections = ['home','products','testimonials','contact'];
const navLinks = document.querySelectorAll('nav a[href^="#"]');

function setActive(id) {
  navLinks.forEach(link => {
    const active = link.getAttribute('href') === '#' + id;
    link.classList.toggle('text-[#037FFD]',   active);
    link.classList.toggle('border-[#037FFD]', active);
    link.classList.toggle('border-transparent', !active);
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () =>
    setActive(link.getAttribute('href').slice(1))
  );
});

function onScroll() {
  // navbar shadow
  header.classList.toggle('nav-scrolled', window.scrollY > 10);

  // active link
  const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 5;
  if (atBottom) { setActive('contact'); return; }

  const navH = header.offsetHeight;
  let current = sections[0];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= navH + 5) current = id;
  });
  setActive(current);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ══════════════════════════════════════════════════════════
   2. SCROLL REVEAL  –  staggered fade-up for every section
══════════════════════════════════════════════════════════ */
function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  // Sections
  document.querySelectorAll('section, .products').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

  // Feature cards  (staggered)
  document.querySelectorAll('.feature-card').forEach((el, i) => {
    el.classList.add('reveal', `reveal-d${Math.min(i + 1, 6)}`);
    io.observe(el);
  });

  // Product cards  (staggered)
  document.querySelectorAll('.prod-card').forEach((el, i) => {
    el.classList.add('reveal', `reveal-d${Math.min(i + 1, 6)}`);
    io.observe(el);
  });

  // Review wrappers  (staggered)
  document.querySelectorAll('.review-wrapper').forEach((el, i) => {
    el.classList.add('reveal', `reveal-d${Math.min(i + 1, 6)}`);
    io.observe(el);
  });

  // Happy-users stat block
  document.querySelectorAll('.stat-block').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

  // Artwork / map images
  document.querySelectorAll('.reveal-img').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

if ('IntersectionObserver' in window) setupReveal();

/* ══════════════════════════════════════════════════════════
   3. COUNT-UP  –  animates 35M+ / 200k / 4.8 when in view
══════════════════════════════════════════════════════════ */
function animateCount(el) {
  const raw    = el.dataset.target;       // e.g. "35", "200", "4.8"
  const suffix = el.dataset.suffix || ''; // e.g. "M+", "k", ""
  const target = parseFloat(raw);
  const isFloat = raw.includes('.');
  const dur   = 1600; // ms
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / dur, 1);
    // ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const val   = target * eased;
    el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

if ('IntersectionObserver' in window) {
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => countIO.observe(el));
}

/* ══════════════════════════════════════════════════════════
   4. MODAL  –  animated open / close + scroll lock
══════════════════════════════════════════════════════════ */
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}
function lockBodyScroll() {
  const w = getScrollbarWidth();
  document.body.style.overflow     = 'hidden';
  document.body.style.paddingRight = w + 'px';
  if (header) header.style.paddingRight = w + 'px';
}
function unlockBodyScroll() {
  document.body.style.overflow     = '';
  document.body.style.paddingRight = '';
  if (header) header.style.paddingRight = '';
}

// Build one reusable modal
const reviewModal = document.createElement('div');
reviewModal.id = 'reviewModal';
reviewModal.innerHTML = `
  <div id="reviewModalCard">
    <button id="closeReviewModal">✕</button>
    <h2 id="reviewModalTitle" style="font-size:1.1rem;font-weight:700;margin-bottom:.75rem;padding-right:1.5rem;"></h2>
    <p  id="reviewModalBody"  style="font-size:.875rem;line-height:1.7;max-height:60vh;overflow-y:auto;padding-right:.5rem;"></p>
  </div>`;
document.body.appendChild(reviewModal);

function openReviewModal(title, body) {
  document.getElementById('reviewModalTitle').textContent = title;
  document.getElementById('reviewModalBody').textContent  = body;
  lockBodyScroll();
  reviewModal.classList.add('modal-open');
}
function closeReviewModal() {
  reviewModal.classList.remove('modal-open');
  setTimeout(unlockBodyScroll, 280);
}

document.getElementById('closeReviewModal').addEventListener('click', closeReviewModal);
reviewModal.addEventListener('click', e => { if (e.target === reviewModal) closeReviewModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && reviewModal.classList.contains('modal-open')) closeReviewModal();
});

// Wire review buttons
[1,2,3,4,5,6].forEach(n => {
  const btn = document.getElementById(`rev${n}`);
  const p   = document.getElementById(`p-${['1st','2nd','3rd','4th','5th','6th'][n-1]}Review`);
  if (!btn || !p) return;
  btn.addEventListener('click', () => {
    const h = p.closest('[class]')?.querySelector('h1,h2,h3');
    openReviewModal(h ? h.innerText.trim() : 'Review', p.innerText.trim());
  });
});


/* ══════════════════════════════════════════════════════════
   5. MOBILE NAV  –  close dropdown when a link is tapped
══════════════════════════════════════════════════════════ */
const mobileDropdown = document.getElementById('dropdown');
const mobileLinks    = mobileDropdown ? mobileDropdown.querySelectorAll('a') : [];

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Flowbite manages the hidden class; also manually hide for reliability
    if (mobileDropdown) {
      mobileDropdown.classList.add('hidden');
    }
  });
});

// Close mobile nav when tapping outside
document.addEventListener('click', (e) => {
  if (!mobileDropdown) return;
  const btn = document.getElementById('dropdownDefaultButton');
  if (
    !mobileDropdown.classList.contains('hidden') &&
    !mobileDropdown.contains(e.target) &&
    e.target !== btn && !btn.contains(e.target)
  ) {
    mobileDropdown.classList.add('hidden');
  }
});

/* ══════════════════════════════════════════════════════════
   6. TOUCH  –  passive touch listeners for better scroll perf
══════════════════════════════════════════════════════════ */
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove',  () => {}, { passive: true });
