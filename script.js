/* ══════════════════════════════════════════
   ABHISHEK KUMAR — PORTFOLIO JAVASCRIPT
   script.js
   ══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. CUSTOM CURSOR (desktop only)
───────────────────────────────────────── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

if (window.matchMedia('(hover: hover)').matches) {

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 5 + 'px';
    cursor.style.top  = mouseY - 5 + 'px';
  });

  function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top  = ringY - 18 + 'px';
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width  = '60px';
      cursorRing.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width  = '36px';
      cursorRing.style.height = '36px';
    });
  });
}

/* ─────────────────────────────────────────
   2. NAVBAR — shrink on scroll
───────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─────────────────────────────────────────
   3. SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* ─────────────────────────────────────────
   4. CONTACT FORM — Validation & Submission
───────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('form-status');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmsg').value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = '⚠️ Please fill in all fields.';
    formStatus.style.color = '#f472b6';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formStatus.textContent = '⚠️ Please enter a valid email address.';
    formStatus.style.color = '#f472b6';
    return;
  }

  formStatus.textContent = '⏳ Sending...';
  formStatus.style.color = '#64748b';

  /*
   ╔═══════════════════════════════════════════════════════╗
   ║  TO CONNECT A REAL BACKEND, replace the setTimeout    ║
   ║  below with one of these:                             ║
   ║                                                       ║
   ║  A) EmailJS (free, no server):                        ║
   ║     emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {       ║
   ║       from_name: name, from_email: email,             ║
   ║       message: message                                ║
   ║     })                                                ║
   ║                                                       ║
   ║  B) Your own API / backend:                           ║
   ║     fetch('/api/contact', {                           ║
   ║       method: 'POST',                                 ║
   ║       headers: {'Content-Type': 'application/json'},  ║
   ║       body: JSON.stringify({name, email, message})    ║
   ║     })                                                ║
   ╚═══════════════════════════════════════════════════════╝
  */

  setTimeout(() => {
    formStatus.textContent = `✅ Thanks ${name}! I'll get back to you soon.`;
    formStatus.style.color = '#6ee7b7';
    contactForm.reset();
  }, 1200);
});

/* ─────────────────────────────────────────
   5. CERTIFICATE MODAL
───────────────────────────────────────── */

// Certificate data — edit title, org, image path, desc and tags here
const certs = [
  {
    title : 'Elements of AI',
    org   : 'University of Helsinki & MinnaLearn',
    image : 'image/Certificate/certificateAI.png',
    desc  : 'Completed the Elements of AI online course, covering foundational concepts of Artificial Intelligence including machine learning basics, neural networks, the societal impact of AI, and real-world AI applications. Certified by the University of Helsinki and MinnaLearn.',
    tags  : ['Artificial Intelligence', 'Machine Learning', 'Neural Networks', 'AI Ethics']
  },
  {
    title : 'GenAI Powered Data Analytics',
    org   : 'Tata Job Simulation',
    image : 'image/Certificate/certificateData.png',
    desc  : "Completed Tata's GenAI Powered Data Analytics job simulation, gaining hands-on experience with AI-driven data analytics workflows, generative AI tools, data interpretation, and how businesses leverage AI for decision-making.",
    tags  : ['GenAI', 'Data Analytics', 'Tata', 'AI Tools', 'Business Intelligence']
  }
];

const modal      = document.getElementById('certModal');
const modalClose = document.getElementById('certModalClose');
const modalTitle = document.getElementById('certModalTitle');
const modalOrg   = document.getElementById('certModalOrg');
const modalDesc  = document.getElementById('certModalDesc');
const modalTags  = document.getElementById('certModalTags');
const modalImg   = document.getElementById('certModalImg');

// Open modal — populate with cert data, show image only
function openCert(index) {
  const cert = certs[index];

  modalTitle.textContent = cert.title;
  modalOrg.textContent   = cert.org;
  modalDesc.textContent  = cert.desc;
  modalTags.innerHTML    = cert.tags.map(t => `<span>${t}</span>`).join('');

  // Always show image (no placeholder in modal anymore)
  if (cert.image && cert.image.trim() !== '') {
    modalImg.src = cert.image;
    modalImg.alt = cert.title;
    modalImg.classList.remove('cert-modal-img--hidden');
  } else {
    // No image set — hide the img entirely
    modalImg.classList.add('cert-modal-img--hidden');
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Close when clicking the X button
function closeCertModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close when clicking the dark backdrop
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeCertModal();
});

// Close when clicking the X button
modalClose.addEventListener('click', closeCertModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeCertModal();
  }
});

// Keyboard accessibility — open cert card with Enter or Space
document.querySelectorAll('.cert-card').forEach((card, index) => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCert(index);
    }
  });
});