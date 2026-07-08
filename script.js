// ===== Backend Config =====
function getBackendUrl() {
  return (window.CIDENG_CONFIG && window.CIDENG_CONFIG.GOOGLE_SCRIPT_URL || '').trim();
}

function isBackendReady() {
  return /^https:\/\/script\.google\.com\/macros\/s\//.test(getBackendUrl());
}

// ===== Save Registration to Google Sheets =====
async function saveRegistration(entry) {
  if (!isBackendReady()) {
    throw new Error('尚未設定 Google Sheets 後端網址');
  }

  const payload = new URLSearchParams();
  payload.set('action', 'register');
  Object.keys(entry).forEach((key) => payload.set(key, entry[key] || ''));

  const response = await fetch(getBackendUrl(), {
    method: 'POST',
    mode: 'no-cors',
    body: payload
  });

  return { status: 'success' };
}

// ===== Floating Particles =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 30;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 6) + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

// ===== Intersection Observer for Scroll Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.animationPlayState = 'paused';
    observer.observe(item);
  });
}

function setSubmitState(isSubmitting) {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;

  btn.disabled = isSubmitting;
  btn.classList.toggle('is-loading', isSubmitting);
  const text = btn.querySelector('.submit-text');
  const icon = btn.querySelector('.submit-icon');
  if (text) text.textContent = isSubmitting ? '送出中...' : '送出報名';
  if (icon) icon.textContent = isSubmitting ? '•' : '→';
}

function showFormMessage(message, type) {
  let el = document.getElementById('formMessage');
  const form = document.getElementById('registrationForm');
  if (!el && form) {
    el = document.createElement('p');
    el.id = 'formMessage';
    el.className = 'form-message';
    form.appendChild(el);
  }
  if (!el) return;

  el.textContent = message;
  el.className = `form-message ${type || ''}`.trim();
}

// ===== Form Handling =====
async function handleSubmit(e) {
  e.preventDefault();

  const form = document.getElementById('registrationForm');
  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  const requiredFields = ['name', 'gender', 'phone', 'role', 'location', 'nearbyTemple', 'arrivalTime', 'accommodation', 'hsrPickup'];
  const missing = requiredFields.filter(f => !data[f]);

  if (missing.length > 0) {
    showFormMessage('請先填完必填欄位。', 'error');
    shakeButton();
    return;
  }

  setSubmitState(true);
  showFormMessage('', '');

  try {
    await saveRegistration(data);

    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    form.reset();
  } catch (error) {
    showFormMessage(error.message || '報名送出失敗，請稍後再試。', 'error');
    shakeButton();
  } finally {
    setSubmitState(false);
  }
}

function closeModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    });
  }
});

// ===== Button Shake Animation =====
function shakeButton() {
  const btn = document.getElementById('submitBtn');
  btn.style.animation = 'shake 0.5s ease';
  setTimeout(() => {
    btn.style.animation = '';
  }, 500);
}

// Add shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }

  .form-submit:disabled {
    cursor: wait;
    opacity: 0.75;
  }

  .form-message {
    min-height: 1.5rem;
    margin-top: 1rem;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .form-message.error {
    color: #c0392b;
  }
`;
document.head.appendChild(shakeStyle);

// ===== Smooth Scroll for CTA =====
document.addEventListener('DOMContentLoaded', () => {
  const cta = document.querySelector('.hero-cta');
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#register');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});

// ===== Input Focus Effects =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initScrollAnimations();

  if (!isBackendReady()) {
    showFormMessage('尚未設定 Google Sheets 後端，請先完成 config.js 設定。', 'error');
  }
});

// ===== Escape key closes modal =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
