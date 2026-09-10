/**
 * PawsHaven - Common App Utilities & Global Controllers
 */

// ---------------------------------------------------------------------------
// 1. Toast Notification System
// ---------------------------------------------------------------------------
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  let iconHtml = '<i class="bi bi-check-circle-fill"></i>';
  if (type === 'error') iconHtml = '<i class="bi bi-exclamation-triangle-fill"></i>';
  if (type === 'info') iconHtml = '<i class="bi bi-info-circle-fill"></i>';

  toast.innerHTML = `
    <div class="toast-icon">${iconHtml}</div>
    <div class="flex-1 text-sm font-medium">${message}</div>
    <button class="text-xs opacity-60 hover:opacity-100 p-1" onclick="this.parentElement.remove()">
      <i class="bi bi-x-lg"></i>
    </button>
  `;

  container.appendChild(toast);

  // Trigger entrance transition
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ---------------------------------------------------------------------------
// 2. Theme & Dark Mode Controller
// ---------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('paws_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  updateThemeIcons(savedTheme);
}

let _themeToggleLock = false;
function toggleTheme() {
  if (_themeToggleLock) return;
  _themeToggleLock = true;
  setTimeout(() => { _themeToggleLock = false; }, 350);

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
  localStorage.setItem('paws_theme', newTheme);
  updateThemeIcons(newTheme);
  showToast(`${newTheme === 'dark' ? 'Cozy Dark Mode' : 'Airy Light Mode'} activated`, 'info', 2000);
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill text-amber-400 theme-toggle-icon';
    } else {
      icon.className = 'bi bi-moon-stars-fill theme-toggle-icon';
    }
  });
}

// ---------------------------------------------------------------------------
// 3. RTL Mode Controller
// ---------------------------------------------------------------------------
function initRTL() {
  const savedDir = localStorage.getItem('paws_dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  if (savedDir === 'rtl') {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
}

let _rtlToggleLock = false;
function toggleRTL() {
  if (_rtlToggleLock) return;
  _rtlToggleLock = true;
  setTimeout(() => { _rtlToggleLock = false; }, 350);

  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', newDir);
  localStorage.setItem('paws_dir', newDir);
  if (newDir === 'rtl') {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
  showToast(`Switched layout to ${newDir.toUpperCase()}`, 'info', 2000);
}

// ---------------------------------------------------------------------------
// 4. Modal System Controller
// ---------------------------------------------------------------------------
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    const lightbox = document.getElementById('paws-lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// ---------------------------------------------------------------------------
// 5. Auth Session Management
// ---------------------------------------------------------------------------
function getCurrentUser() {
  const user = sessionStorage.getItem('paws_current_user') || localStorage.getItem('paws_current_user');
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  sessionStorage.setItem('paws_logged_in_this_session', 'true');
  sessionStorage.setItem('paws_current_user', JSON.stringify(user));
  localStorage.setItem('paws_current_user', JSON.stringify(user));
}

function logout() {
  sessionStorage.removeItem('paws_logged_in_this_session');
  sessionStorage.removeItem('paws_current_user');
  localStorage.removeItem('paws_current_user');
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 600);
}

// ---------------------------------------------------------------------------
// 6. Global Lightbox Viewer
// ---------------------------------------------------------------------------
function openLightbox(imgSrc, caption = '') {
  let lightbox = document.getElementById('paws-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'paws-lightbox';
    lightbox.className = 'modal-overlay';
    lightbox.innerHTML = `
      <div class="relative max-w-4xl w-full p-4 flex flex-col items-center">
        <button onclick="closeLightbox()" class="absolute -top-12 right-2 text-white text-3xl hover:text-[#E07A5F] transition z-50">
          <i class="bi bi-x-circle-fill"></i>
        </button>
        <img id="lightbox-img" src="" alt="Full view" class="max-h-[80vh] w-auto rounded-2xl shadow-2xl object-contain border-4 border-white/20">
        <div id="lightbox-caption" class="mt-4 text-white text-center font-medium bg-black/50 backdrop-blur-md px-6 py-2 rounded-full text-sm"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  document.getElementById('lightbox-img').src = imgSrc;
  document.getElementById('lightbox-caption').textContent = caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('paws-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ---------------------------------------------------------------------------
// 7. Interactive Number Counter Animation
// ---------------------------------------------------------------------------
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const duration = 1800;
        const stepTime = 25;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target.toLocaleString();
            clearInterval(timer);
          } else {
            counter.innerText = Math.floor(current).toLocaleString();
          }
        }, stepTime);

        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

// ---------------------------------------------------------------------------
// 8. Global Quick Book Modal Trigger
// ---------------------------------------------------------------------------
function quickBookService(serviceSlug) {
  // Store selected service in sessionStorage for prefill
  if (serviceSlug) {
    sessionStorage.setItem('paws_booking_preset', serviceSlug);
  }
  const activeSession = sessionStorage.getItem('paws_logged_in_this_session');
  const currentUser = localStorage.getItem('paws_current_user');
  if (!activeSession || !currentUser) {
    if (typeof openAuthModal === 'function') {
      openAuthModal('login', 'booking.html');
      return;
    }
    window.location.href = 'index.html?auth=login&redirect=booking.html';
  } else {
    window.location.href = 'booking.html';
  }
}

// ---------------------------------------------------------------------------
// Global Init on DOM Loaded & Delegated Event Handlers
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initCounters();
});


// ---------------------------------------------------------------------------
// 9. Exclusive FAQ Accordion Controller (only one FAQ question open at a time)
// ---------------------------------------------------------------------------
document.addEventListener('click', (e) => {
  const summary = e.target.closest('summary');
  if (!summary) return;
  const details = summary.parentElement;
  if (!details || details.tagName !== 'DETAILS') return;

  // When opening a details element, close all other open details in the same container
  if (!details.open) {
    const container = details.closest('.faq-accordion, .space-y-4') || details.parentElement;
    if (container) {
      container.querySelectorAll('details[open]').forEach(other => {
        if (other !== details) {
          other.removeAttribute('open');
        }
      });
    }
  }
});

// Capture-phase toggle listener fallback for programmatic or keyboard opening
document.addEventListener('toggle', (e) => {
  if (e.target.tagName === 'DETAILS' && e.target.open) {
    const container = e.target.closest('.faq-accordion, .space-y-4') || e.target.parentElement;
    if (container) {
      container.querySelectorAll('details[open]').forEach(other => {
        if (other !== e.target) {
          other.removeAttribute('open');
        }
      });
    }
  }
}, true);
