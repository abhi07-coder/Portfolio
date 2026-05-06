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
   4. DUPLICATE EMAIL CHECK (localStorage)
   Stores submitted emails so same address
   cannot submit the form a second time.
───────────────────────────────────────── */
const STORAGE_KEY = 'ak_contacted_emails';

function getContactedEmails() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (err) {
    return [];
  }
}

function hasAlreadyMessaged(email) {
  return getContactedEmails().includes(email.toLowerCase());
}

function saveContactedEmail(email) {
  const list = getContactedEmails();
  if (!list.includes(email.toLowerCase())) {
    list.push(email.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

/* ─────────────────────────────────────────
   5. CONTACT FORM — Validation & EmailJS
───────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('form-status');
const submitBtn   = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmsg').value.trim();

  // ── 1. Empty field check ──────────────────────────────────────────────
  if (!name || !email || !message) {
    formStatus.textContent = '⚠️ Please fill in all fields.';
    formStatus.style.color = '#f472b6';
    return;
  }

  // ── 2. Email format check ─────────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formStatus.textContent = '⚠️ Please enter a valid email address.';
    formStatus.style.color = '#f472b6';
    return;
  }

  // ── 3. Duplicate email check ──────────────────────────────────────────
  if (hasAlreadyMessaged(email)) {
    formStatus.innerHTML   = `📬 <strong>${name}</strong> already sent me a message. I'll reply to you soon — please be patient!`;
    formStatus.style.color = '#38bdf8';
    return;
  }

  // ── 4. Disable button to prevent double-click ─────────────────────────
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';
  formStatus.textContent = '⏳ Sending your message...';
  formStatus.style.color = '#64748b';

  // ── 5. EmailJS — sends 2 emails ───────────────────────────────────────
  //   STEP A: Replace these 3 IDs with your own from emailjs.com
  //   STEP B: Replace YOUR_PUBLIC_KEY in index.html <head>
  // ─────────────────────────────────────────────────────────────────────
  const SERVICE_ID        = 'service_3cghqe8';
  const NOTIFY_TEMPLATE   = 'template_zx1wryf';    // you receive this
  const AUTOREPLY_TEMPLATE = 'template_qmdcb8j'; // sender receives this

  const templateParams = {
    from_name  : name,
    from_email : email,
    message    : message,
    reply_to   : email
  };

  // Send notification to you, then send auto-reply to the visitor
  emailjs.send(SERVICE_ID, NOTIFY_TEMPLATE, templateParams)
    .then(() => emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE, templateParams))
    .then(() => {
      // ✅ Success — save email to block future duplicates
      saveContactedEmail(email);
      formStatus.innerHTML   = `✅ Your massage has been sent Successfully. \n I'll respond you soon <strong>${name}</strong>.`;
      formStatus.style.color = '#6ee7b7';
      submitBtn.disabled     = false;
      submitBtn.textContent  = 'Send Message →';
      contactForm.reset();
    })
    .catch((error) => {
      // ❌ Error
      console.error('EmailJS error:', error);
      formStatus.textContent = '❌ Something went wrong. Please email me directly at abhishekkumar788477@gmail.com';
      formStatus.style.color = '#f472b6';
      submitBtn.disabled     = false;
      submitBtn.textContent  = 'Send Message →';
    });
});

/* ─────────────────────────────────────────
   6. CERTIFICATE MODAL
───────────────────────────────────────── */

// Certificate data — update image paths, desc and tags here
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

function openCert(index) {
  const cert = certs[index];

  modalTitle.textContent = cert.title;
  modalOrg.textContent   = cert.org;
  modalDesc.textContent  = cert.desc;
  modalTags.innerHTML    = cert.tags.map(t => `<span>${t}</span>`).join('');

  if (cert.image && cert.image.trim() !== '') {
    modalImg.src = cert.image;
    modalImg.alt = cert.title;
    modalImg.classList.remove('cert-modal-img--hidden');
  } else {
    modalImg.classList.add('cert-modal-img--hidden');
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeCertModal();
});

modalClose.addEventListener('click', closeCertModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeCertModal();
  }
});

document.querySelectorAll('.cert-card').forEach((card, index) => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCert(index);
    }
  });
});