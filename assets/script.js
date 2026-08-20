document.documentElement.classList.add('js-ready');
document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

const PROJECTS = [
  {
    src: '/media/file_954e7ac2-f2b8-47fd-ae68-af44b5b54277', alt: 'Contemporary black motorised sliding gate', category: 'Gates & Access', title: 'Motorised sliding gate', description: 'A sleek slatted steel gate that brings practical access control and a strong modern street presence.'
  },
  {
    src: '/media/file_64de1509-82a7-4bd0-822a-66718d8c034e', alt: 'Motorised steel driveway gate at a residential entrance', category: 'Gates & Access', title: 'Driveway entrance gate', description: 'A made-to-measure driveway gate combining secure automated access with an open, welcoming profile.'
  },
  {
    src: '/media/file_b3ece2e3-f782-4099-943d-6957359fcee2', alt: 'Black steel fence installed along a white boundary wall', category: 'Fencing & Security', title: 'Boundary wall fencing', description: 'Custom steel boundary fencing that adds security while preserving light, visibility and a clean finish.'
  },
  {
    src: '/media/file_5dfa7194-baf3-4a4d-bf77-723282f04d9b', alt: 'White steel railing fitted to a residential stairway', category: 'Fencing & Security', title: 'Residential stair fencing', description: 'Neat, durable steel railing tailored to make an elevated outdoor area safer and more defined.'
  },
  {
    src: '/media/file_cc4699a3-ebd8-419f-8846-cdd54354da78', alt: 'Steel balcony barrier fitted beneath a window', category: 'Balustrades & Barriers', title: 'Window safety barrier', description: 'A robust steel safety barrier designed for everyday protection without compromising the building exterior.'
  },
  {
    src: '/media/file_b28a1d4a-2774-423e-99d6-e3a89b1c4a0e', alt: 'Steel security gate fitted at a shop entrance', category: 'Commercial Security', title: 'Shopfront security gate', description: 'A practical shopfront gate that secures the premises after hours while keeping the entrance professional.'
  },
  {
    src: '/media/file_b53983f2-89f9-4630-98d1-d0f134cb616d', alt: 'Steel security fencing installed around a home', category: 'Home Security', title: 'Home security fencing', description: 'Purpose-built security fencing that strengthens the property perimeter with a considered residential finish.'
  },
  {
    src: '/media/file_733ed4ee-aad3-4643-adc3-6db1caa36781', alt: 'Steel scaffolding and protective barriers on an industrial site', category: 'Industrial Steelwork', title: 'Industrial safety barriers', description: 'Hard-wearing fabricated barriers that help organise and protect active industrial work areas.'
  },
  {
    src: '/media/file_fb770fd3-5ef8-4196-aed0-e4b6bed30813', alt: 'Decorative black steel security gate at a home entrance', category: 'Home Security', title: 'Decorative security gate', description: 'A custom entrance gate that pairs classic detailing with dependable day-to-day security.'
  },
  {
    src: '/media/file_a1c6bd2d-64cb-4aed-9e8f-1293b9816e6c', alt: 'Ornamental steel home security gate', category: 'Home Security', title: 'Ornamental security gate', description: 'A detailed steel security gate created to protect the home while complementing its existing character.'
  },
  {
    src: '/media/file_45338ddb-c01d-4769-a779-7bca2b0bdeee', alt: 'Steel fencing installed on top of a residential wall', category: 'Fencing & Security', title: 'Wall-top security fencing', description: 'A clean wall-top steel fence that extends perimeter protection with a light, refined visual profile.'
  },
  {
    src: '/media/file_282ee3b0-f795-4f22-b0d4-ebb17eaf4c02', alt: 'Motorised steel gate at a driveway entrance', category: 'Gates & Access', title: 'Automated driveway gate', description: 'A robust automated gate engineered for reliable access, privacy and a smart finished entrance.'
  }
];

function projectCard(project, compact = false) {
  const button = document.createElement('button');
  button.className = compact
    ? 'project-thumb project-thumb--compact'
    : 'project-thumb';

  button.type = 'button';
  button.setAttribute('aria-label', `Enlarge ${project.title}`);

  button.innerHTML = `
    <img src="${project.src}" alt="${project.alt}" loading="lazy">
    <span>
      <small>${project.category}</small>
      <strong>${project.title}</strong>
      ${compact ? '' : `<em>${project.description}</em>`}
    </span>
  `;

  button.addEventListener('click', () => openLightbox(project));

  return button;
}

const homeStrip = document.querySelector('#home-project-strip');

if (homeStrip) {
  PROJECTS.slice(0, 3).forEach(project =>
    homeStrip.appendChild(projectCard(project, true))
  );
}

const gallery = document.querySelector('#project-gallery');

if (gallery) {
  PROJECTS.forEach(project =>
    gallery.appendChild(projectCard(project))
  );
}

function openLightbox(project) {
  const dialog = document.createElement('div');

  dialog.className = 'lightbox';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', project.title);

  dialog.innerHTML = `
    <button
      class="lightbox__close"
      type="button"
      aria-label="Close image"
    >
      ×
    </button>

    <figure>
      <img src="${project.src}" alt="${project.alt}">
      <figcaption>
        <div>
          <small>${project.category}</small>
          <strong>${project.title}</strong>
        </div>
        <p>${project.description}</p>
      </figcaption>
    </figure>
  `;

  const close = () => {
    dialog.remove();
    document.body.classList.remove('lightbox-open');
  };

  dialog.addEventListener('click', event => {
    if (event.target === dialog) close();
  });

  dialog
    .querySelector('.lightbox__close')
    .addEventListener('click', close);

  document.addEventListener('keydown', function escape(event) {
    if (event.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escape);
    }
  });

  document.body.appendChild(dialog);
  document.body.classList.add('lightbox-open');

  dialog.querySelector('.lightbox__close').focus();
}


/* ==========================================================
   PAYMENT LOCK

   Activation date: 15 January 2027
   Administrator code: 3010

   NOTE:
   This is client-side protection intended as a payment
   deterrent for static hosting. It is not secure server-side
   authentication.
   ========================================================== */

(() => {

  const params = new URLSearchParams(location.search);
  const now = new Date();

  const billingMonth =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const storageKey = 'tse_payment_month';

  const testMode = params.get('payment-test') === '1';


  /* ----------------------------------------------------------
     Reset stored payment status
     ---------------------------------------------------------- */

  if (params.get('payment-reset') === '1') {
    localStorage.removeItem(storageKey);
  }


  /* ----------------------------------------------------------
     PAYMENT LOCK START DATE

     15 January 2027
     JavaScript months start at 0:
     January = 0
     ---------------------------------------------------------- */

  const lockStartDate = new Date(2027, 0, 15);

  const lockDateReached = now >= lockStartDate;


  /* ----------------------------------------------------------
     Determine whether the website should be locked
     ---------------------------------------------------------- */

  if (
    !(
      (lockDateReached || testMode) &&
      localStorage.getItem(storageKey) !== billingMonth
    )
  ) {
    return;
  }


  /* ----------------------------------------------------------
     Display payment lock
     ---------------------------------------------------------- */

  document.documentElement.classList.add('payment-locked');

  const lock = document.createElement('div');

  lock.className = 'payment-lock';
  lock.setAttribute('role', 'dialog');
  lock.setAttribute('aria-modal', 'true');

  lock.innerHTML = `
    <div class="payment-lock__panel">

      <div class="payment-lock__top">
        <img
          src="assets/twisted-steel-logo.jpg"
          alt="Twisted Steel Engineering"
        >
        <span>PAYMENT NOTICE</span>
      </div>

      <p class="payment-lock__eyebrow">
        ACCOUNT SUSPENDED
      </p>

      <h1>
        Website temporarily unavailable
      </h1>

      <p>
        The monthly website service payment is outstanding.
        Access will be restored after payment is confirmed.
      </p>

      <div class="payment-summary">

        <div>
          <span>Service</span>
          <strong>
            Web hosting &amp; website maintenance
          </strong>
        </div>

        <div>
          <span>Billing period</span>
          <strong>Monthly</strong>
        </div>

        <div class="payment-summary__total">
          <span>Amount outstanding</span>
          <strong>R250.00</strong>
        </div>

      </div>

      <form class="payment-lock__form">

        <label for="payment-code">
          Administrator code
        </label>

        <div>
          <input
            id="payment-code"
            type="password"
            autocomplete="off"
            required
            placeholder="Enter code"
          >

          <button type="submit">
            Unlock
          </button>
        </div>

        <p
          class="payment-lock__error"
          aria-live="polite"
        ></p>

      </form>

      ${
        testMode
          ? '<small>Test mode is active</small>'
          : ''
      }

    </div>
  `;

  document.body.appendChild(lock);


  const form = lock.querySelector('form');
  const input = lock.querySelector('input');
  const error =
    lock.querySelector('.payment-lock__error');


  /* ----------------------------------------------------------
     PASSWORD CHECK

     Password: 3010

     SHA-256:
     ff4b467b7a593047c46682ecdbf6da36b3f3bb4b50d35f08f17f751ef5f15531
     ---------------------------------------------------------- */

  form.addEventListener('submit', async event => {

    event.preventDefault();

    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(input.value.trim())
    );

    const hash = [...new Uint8Array(digest)]
      .map(byte =>
        byte.toString(16).padStart(2, '0')
      )
      .join('');


    if (
      hash ===
      'ff4b467b7a593047c46682ecdbf6da36b3f3bb4b50d35f08f17f751ef5f15531'
    ) {

      localStorage.setItem(
        storageKey,
        billingMonth
      );

      document.documentElement
        .classList.remove('payment-locked');

      lock.remove();

    } else {

      error.textContent =
        'Incorrect code. Please try again.';

      input.value = '';
      input.focus();

    }

  });


  setTimeout(() => input.focus(), 50);

})();


/* ==========================================================
   MOBILE MENU
   ========================================================== */

const menu = document.querySelector('.menu');

if (menu) {

  const nav = document.querySelector('.nav nav');

  if (!nav.querySelector('.mobile-quote')) {

    nav.insertAdjacentHTML(
      'beforeend',
      '<a class="button mobile-quote" href="contact.html">Request a quote <span>↗</span></a>'
    );

  }

  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');


  const closeMenu = () => {

    document.body.classList.remove('menu-open');

    menu.setAttribute(
      'aria-expanded',
      'false'
    );

    menu.setAttribute(
      'aria-label',
      'Open navigation'
    );

    menu.innerHTML =
      'Menu <span>≡</span>';

  };


  menu.addEventListener('click', () => {

    const open =
      !document.body.classList.contains('menu-open');

    document.body.classList.toggle(
      'menu-open',
      open
    );

    menu.setAttribute(
      'aria-expanded',
      String(open)
    );

    menu.setAttribute(
      'aria-label',
      open
        ? 'Close navigation'
        : 'Open navigation'
    );

    menu.innerHTML = open
      ? 'Close <span>×</span>'
      : 'Menu <span>≡</span>';

  });


  nav.querySelectorAll('a').forEach(link =>
    link.addEventListener(
      'click',
      closeMenu
    )
  );

}


/* ==========================================================
   CONTACT FORM
   ========================================================== */

const contactForm =
  document.querySelector('#contact-form');

if (contactForm) {

  contactForm.noValidate = true;

  const requiredFields = [
    ...contactForm.querySelectorAll('[required]')
  ];


  requiredFields.forEach(field =>
    field.addEventListener(
      'input',
      () => clearFieldError(field)
    )
  );


  contactForm.addEventListener(
    'submit',
    event => {

      event.preventDefault();

      let valid = true;


      requiredFields.forEach(field => {

        if (!field.value.trim()) {

          showFieldError(
            field,
            'Please complete this field.'
          );

          valid = false;

        } else {

          clearFieldError(field);

        }

      });


      if (!valid) {

        contactForm
          .querySelector('[aria-invalid="true"]')
          .focus();

        return;

      }


      const data =
        new FormData(contactForm);

      const button =
        contactForm.querySelector(
          'button[type="submit"]'
        );


      const text =
`Hello Robert, I would like to request a quote from Twisted Steel Engineering.

Name: ${data.get('name')}
Phone: ${data.get('phone')}
Service: ${data.get('service')}
Project: ${data.get('message') || ''}`;


      button.disabled = true;

      button.classList.add('is-loading');

      button.innerHTML =
        'Opening WhatsApp… <span>↗</span>';


      window.open(
        `https://wa.me/27718175856?text=${encodeURIComponent(text)}`,
        '_blank',
        'noopener'
      );


      setTimeout(() => {

        button.disabled = false;

        button.classList.remove(
          'is-loading'
        );

        button.innerHTML =
          'Send via WhatsApp <span>↗</span>';

      }, 1400);

    }
  );

}


/* ==========================================================
   FORM ERRORS
   ========================================================== */

function showFieldError(field, message) {

  field.setAttribute(
    'aria-invalid',
    'true'
  );

  let error =
    field.parentElement.querySelector(
      '.field-error'
    );


  if (!error) {

    error =
      document.createElement('span');

    error.className =
      'field-error';

    field.parentElement.appendChild(
      error
    );

  }


  error.textContent = message;

}


function clearFieldError(field) {

  field.removeAttribute(
    'aria-invalid'
  );

  field.parentElement
    .querySelector('.field-error')
    ?.remove();

}


/* ==========================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================== */

const revealTargets =
  document.querySelectorAll(
    '.section h2, .service-grid a, .steps > div, .service-list article, .project-thumb, .gallery-intro'
  );


revealTargets.forEach(target =>
  target.classList.add('reveal')
);


if (
  'IntersectionObserver' in window &&
  !matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
) {

  const observer =
    new IntersectionObserver(
      entries =>
        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'is-visible'
            );

            observer.unobserve(
              entry.target
            );

          }

        }),
      {
        threshold: .12
      }
    );


  revealTargets.forEach(target =>
    observer.observe(target)
  );


} else {

  revealTargets.forEach(target =>
    target.classList.add('is-visible')
  );

}
