const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

if (mobileToggle && navMenu) {
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });
}

document.querySelectorAll('.dropdown').forEach((dropdown) => {
  const link = dropdown.querySelector(':scope > a');
  if (!link) return;

  link.addEventListener('click', (event) => {
    if (window.innerWidth <= 768 && !dropdown.classList.contains('active')) {
      event.preventDefault();
      dropdown.classList.add('active');
    }
  });
});

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('[data-page]').forEach((link) => {
  if (link.dataset.page === currentPage) {
    link.classList.add('active');
  }
});

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 80
      ? '0 16px 36px rgba(0,0,0,.12)'
      : '0 10px 30px rgba(0,0,0,.08)';
  });
}

if (navMenu && mobileToggle) {
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
    }
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const vorname = document.getElementById('vorname')?.value.trim();
    const nachname = document.getElementById('nachname')?.value.trim();
    const telefon = document.getElementById('telefon')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const nachricht = document.getElementById('nachricht')?.value.trim();
    const system = document.getElementById('system')?.value || 'Nicht angegeben';

    if (!vorname || !nachname || !telefon || !email) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    const subject = `Anfrage Taubenabwehr - ${vorname} ${nachname}`;
    const body = [
      'Neue Anfrage über die Website:',
      '',
      `Name: ${vorname} ${nachname}`,
      `Telefon: ${telefon}`,
      `E-Mail: ${email}`,
      `Interessantes System: ${system}`,
      '',
      'Nachricht:',
      nachricht || 'Keine Nachricht angegeben.',
      '',
      '---',
      'Diese Anfrage wurde über das Kontaktformular der Website vorbereitet.'
    ].join('\n');

    location.href = `mailto:taubenabwehr-basic@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const params = new URLSearchParams(location.search);
const requestedSystem = params.get('system');
if (requestedSystem) {
  const messageInput = document.getElementById('nachricht');
  const systemSelect = document.getElementById('system');
  if (messageInput) messageInput.value = `Ich interessiere mich für: ${requestedSystem}`;
  if (systemSelect) systemSelect.value = requestedSystem;
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

document.querySelectorAll('[data-counter]').forEach((element) => {
  let done = false;
  const target = parseInt(element.dataset.counter, 10);

  const run = () => {
    if (done) return;
    done = true;
    let current = 0;

    const step = () => {
      current += Math.max(1, Math.ceil(target / 40));
      if (current >= target) {
        element.textContent = target;
        return;
      }
      element.textContent = current;
      requestAnimationFrame(step);
    };

    step();
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) run();
      });
    }, { threshold: 0.5 }).observe(element);
  } else {
    run();
  }
});

document.querySelectorAll('[data-slider]').forEach((slider) => {
  const slides = [...slider.querySelectorAll('.slide')];
  const thumbs = [...slider.querySelectorAll('.thumb')];
  let index = 0;

  const show = (newIndex) => {
    index = (newIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
    thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === index));
  };

  slider.querySelector('.prev')?.addEventListener('click', () => show(index - 1));
  slider.querySelector('.next')?.addEventListener('click', () => show(index + 1));
  thumbs.forEach((thumb, thumbIndex) => thumb.addEventListener('click', () => show(thumbIndex)));

  if (slides.length > 1) {
    setInterval(() => show(index + 1), 5500);
  }
});

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<button type="button" aria-label="Schließen">×</button><img alt="Großansicht">';
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('img');
lightbox.querySelector('button').addEventListener('click', () => lightbox.classList.remove('active'));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.classList.remove('active');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') lightbox.classList.remove('active');
});

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.lightbox;
    lightbox.classList.add('active');
  });
});
