const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const dialog = document.querySelector('[data-case-dialog]');
const form = document.querySelector('[data-case-form]');
const formView = document.querySelector('[data-form-view]');
const successView = document.querySelector('[data-success-view]');
const caseSelect = document.querySelector('[data-case-select]');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 48);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu.classList.toggle('open', !open);
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
}));

document.querySelectorAll('[data-open-case]').forEach(button => {
  button.addEventListener('click', () => {
    formView.hidden = false;
    successView.hidden = true;
    const type = button.dataset.caseType;
    if (type) caseSelect.value = type;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});

document.querySelectorAll('[data-close-case]').forEach(button => {
  button.addEventListener('click', () => dialog.close());
});

dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const now = new Date();
  const number = String(Math.floor(1000 + Math.random() * 9000));
  document.querySelector('[data-case-reference]').textContent = `LL–${now.getFullYear()}–${number}`;
  formView.hidden = true;
  successView.hidden = false;
  form.reset();
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const start = performance.now();
    const duration = 1100;
    const tick = time => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(element);
  });
}, { threshold: .5 });

document.querySelectorAll('[data-count]').forEach(element => countObserver.observe(element));
