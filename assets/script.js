document.documentElement.classList.add('js-ready');
document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

const PROJECTS = [
  { src: 'assets/hero-warehouse.webp', alt: 'Steel-frame warehouse structure during construction', category: 'Commercial / Structural', title: 'Steel-frame warehouse' },
  { src: 'assets/motorised-gate.webp', alt: 'Modern black motorised steel entrance gate', category: 'Residential / Gates', title: 'Motorised entrance gate' },
  { src: 'assets/steel-pergola.webp', alt: 'Dark steel pergola over an outdoor entertainment area', category: 'Residential / Outdoor', title: 'Covered entertainment area' }
];

function projectCard(project, compact = false) {
  const button = document.createElement('button');
  button.className = compact ? 'project-thumb project-thumb--compact' : 'project-thumb';
  button.type = 'button';
  button.setAttribute('aria-label', `Enlarge ${project.title}`);
  button.innerHTML = `<img src="${project.src}" alt="${project.alt}" loading="lazy"><span><small>${project.category}</small><strong>${project.title}</strong></span>`;
  button.addEventListener('click', () => openLightbox(project));
  return button;
}

const homeStrip = document.querySelector('#home-project-strip');
if (homeStrip) PROJECTS.forEach(project => homeStrip.appendChild(projectCard(project, true)));
const gallery = document.querySelector('#project-gallery');
if (gallery) PROJECTS.forEach(project => gallery.appendChild(projectCard(project)));

function openLightbox(project) {
  const dialog = document.createElement('div');
  dialog.className = 'lightbox';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', project.title);
  dialog.innerHTML = `<button class="lightbox__close" type="button" aria-label="Close image">×</button><figure><img src="${project.src}" alt="${project.alt}"><figcaption><small>${project.category}</small><strong>${project.title}</strong></figcaption></figure>`;
  const close = () => { dialog.remove(); document.body.classList.remove('lightbox-open'); };
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.querySelector('.lightbox__close').addEventListener('click', close);
  document.addEventListener('keydown', function escape(event) { if (event.key === 'Escape') { close(); document.removeEventListener('keydown', escape); } });
  document.body.appendChild(dialog);
  document.body.classList.add('lightbox-open');
  dialog.querySelector('.lightbox__close').focus();
}

/* Basic monthly lock for static hosting. This is a deterrent, not secure access control. */
(() => {
  const params = new URLSearchParams(location.search), now = new Date();
  const billingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const storageKey = 'tse_payment_month', testMode = params.get('payment-test') === '1';
  if (params.get('payment-reset') === '1') localStorage.removeItem(storageKey);
  if (!((now.getDate() >= 15 || testMode) && localStorage.getItem(storageKey) !== billingMonth)) return;
  document.documentElement.classList.add('payment-locked');
  const lock = document.createElement('div');
  lock.className = 'payment-lock'; lock.setAttribute('role', 'dialog'); lock.setAttribute('aria-modal', 'true');
  lock.innerHTML = `<div class="payment-lock__panel"><div class="payment-lock__top"><img src="assets/twisted-steel-logo.jpg" alt="Twisted Steel Engineering"><span>PAYMENT NOTICE</span></div><p class="payment-lock__eyebrow">ACCOUNT SUSPENDED</p><h1>Website temporarily unavailable</h1><p>The monthly website service payment is outstanding. Access will be restored after payment is confirmed.</p><div class="payment-summary"><div><span>Service</span><strong>Web hosting &amp; website maintenance</strong></div><div><span>Billing period</span><strong>Monthly</strong></div><div class="payment-summary__total"><span>Amount outstanding</span><strong>R250.00</strong></div></div><form class="payment-lock__form"><label for="payment-code">Administrator code</label><div><input id="payment-code" type="password" autocomplete="off" required placeholder="Enter code"><button type="submit">Unlock</button></div><p class="payment-lock__error" aria-live="polite"></p></form>${testMode ? '<small>Test mode is active</small>' : ''}</div>`;
  document.body.appendChild(lock);
  const form = lock.querySelector('form'), input = lock.querySelector('input'), error = lock.querySelector('.payment-lock__error');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value.trim()));
    const hash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    if (hash === '46e9844494ec1b4b0208a9e92e38db23381703ad4367f904cf109a82099baeaa') {
      localStorage.setItem(storageKey, billingMonth); document.documentElement.classList.remove('payment-locked'); lock.remove();
    } else { error.textContent = 'Incorrect code. Please try again.'; input.value = ''; input.focus(); }
  });
  setTimeout(() => input.focus(), 50);
})();

const menu = document.querySelector('.menu');
if (menu) {
  const nav = document.querySelector('.nav nav');
  if (!nav.querySelector('.mobile-quote')) nav.insertAdjacentHTML('beforeend', '<a class="button mobile-quote" href="contact.html">Request a quote <span>↗</span></a>');
  menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation');
  const closeMenu = () => { document.body.classList.remove('menu-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); menu.innerHTML = 'Menu <span>≡</span>'; };
  menu.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.innerHTML = open ? 'Close <span>×</span>' : 'Menu <span>≡</span>';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.noValidate = true;
  const requiredFields = [...contactForm.querySelectorAll('[required]')];
  requiredFields.forEach(field => field.addEventListener('input', () => clearFieldError(field)));
  contactForm.addEventListener('submit', event => {
    event.preventDefault(); let valid = true;
    requiredFields.forEach(field => { if (!field.value.trim()) { showFieldError(field, 'Please complete this field.'); valid = false; } else clearFieldError(field); });
    if (!valid) { contactForm.querySelector('[aria-invalid="true"]').focus(); return; }
    const data = new FormData(contactForm), button = contactForm.querySelector('button[type="submit"]');
    const text = `Hello Robert, I would like to request a quote from Twisted Steel Engineering.\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nService: ${data.get('service')}\nProject: ${data.get('message') || ''}`;
    button.disabled = true; button.classList.add('is-loading'); button.innerHTML = 'Opening WhatsApp… <span>↗</span>';
    window.open(`https://wa.me/27718175856?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    setTimeout(() => { button.disabled = false; button.classList.remove('is-loading'); button.innerHTML = 'Send via WhatsApp <span>↗</span>'; }, 1400);
  });
}

function showFieldError(field, message) {
  field.setAttribute('aria-invalid', 'true');
  let error = field.parentElement.querySelector('.field-error');
  if (!error) { error = document.createElement('span'); error.className = 'field-error'; field.parentElement.appendChild(error); }
  error.textContent = message;
}
function clearFieldError(field) { field.removeAttribute('aria-invalid'); field.parentElement.querySelector('.field-error')?.remove(); }

const revealTargets = document.querySelectorAll('.section h2, .service-grid a, .steps > div, .service-list article, .project-thumb, .gallery-intro');
revealTargets.forEach(target => target.classList.add('reveal'));
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  revealTargets.forEach(target => observer.observe(target));
} else revealTargets.forEach(target => target.classList.add('is-visible'));
