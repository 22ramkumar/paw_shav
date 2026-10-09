/**
 * PawsHaven - Common App Utilities & Global Controllers
 */

// ---------------------------------------------------------------------------
// 0. Input Sanitization & Keydown Prevention Helpers (S-letter safe)
// ---------------------------------------------------------------------------
function sanitizeNoSpace(el) {
  if (!el) return;
  el.value = el.value.replace(/\s+/g, '');
}

function sanitizeNameInput(el) {
  if (!el) return;
  el.value = el.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
}

function preventDisallowedSpaces(event, el, mode) {
  const isSpace = event.key === ' ' || event.code === 'Space' || event.keyCode === 32;
  if (!isSpace) return;
  if (mode === 'none') {
    event.preventDefault();
  } else if (mode === 'single') {
    if (el.selectionStart === 0 || el.value.charAt(el.selectionStart - 1) === ' ') {
      event.preventDefault();
    }
  }
}

if (typeof window !== 'undefined') {
  window.sanitizeNoSpace = sanitizeNoSpace;
  window.sanitizeNameInput = sanitizeNameInput;
  window.preventDisallowedSpaces = preventDisallowedSpaces;
}

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
  const urlParams = new URLSearchParams(window.location.search);
  const urlDir = urlParams.get('dir');
  const savedDir = urlDir || localStorage.getItem('paws_dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  if (savedDir === 'rtl') {
    document.documentElement.classList.add('rtl');
    document.documentElement.classList.remove('ltr');
    stabilizeRTLPunctuation();
  } else {
    document.documentElement.classList.remove('rtl');
    document.documentElement.classList.add('ltr');
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
    document.documentElement.classList.remove('ltr');
    stabilizeRTLPunctuation();
  } else {
    document.documentElement.classList.remove('rtl');
    document.documentElement.classList.add('ltr');
  }
  showToast(`Switched layout to ${newDir.toUpperCase()}`, 'info', 2000);
}

/**
 * Ensures trailing neutral punctuation (?, ., !, :, ;) and mid-sentence question marks
 * consistently anchor at the right end of English/Latin sentences in RTL mode.
 */
function stabilizeRTLPunctuation() {
  const dir = document.documentElement.getAttribute('dir') || 'ltr';
  if (dir !== 'rtl') return;

  const selectors = 'h1, h2, h3, h4, h5, h6, summary, .faq-accordion summary span, p, li, label, .badge-pet, dt, dd, figcaption, blockquote, .bidi-text';
  const elements = document.querySelectorAll(selectors);

  elements.forEach(el => {
    if (el.closest('input, textarea, select, script, style')) return;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      let val = node.nodeValue;
      if (!val || !val.trim()) continue;

      if (!val.includes('\u200E')) {
        let updated = val.replace(/([?.!:;])(\s*)$/, '$1\u200E$2');
        updated = updated.replace(/\?(\s*\d)/g, '?\u200E$1');
        if (updated !== val) {
          node.nodeValue = updated;
        }
      }
    }
  });
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
  if (typeof renderPawsNavbar === 'function') {
    renderPawsNavbar(true);
  }
}

function logout() {
  sessionStorage.removeItem('paws_logged_in_this_session');
  sessionStorage.removeItem('paws_current_user');
  localStorage.removeItem('paws_current_user');
  if (typeof renderPawsNavbar === 'function') {
    renderPawsNavbar(true);
  }
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
// 7. Interactive Running Number Counter Animation
// ---------------------------------------------------------------------------
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  function runCounterAnimation(counter) {
    if (counter._rafId) {
      cancelAnimationFrame(counter._rafId);
      counter._rafId = null;
    }

    const targetStr = (counter.getAttribute('data-target') || '0').trim();
    const target = parseFloat(targetStr) || 0;
    const decimalsAttr = counter.getAttribute('data-decimals');
    const decimals = decimalsAttr !== null ? parseInt(decimalsAttr, 10) : (targetStr.includes('.') ? (targetStr.split('.')[1] || '').length : 0);
    const duration = parseInt(counter.getAttribute('data-duration'), 10) || 1800;
    const startVal = parseFloat(counter.getAttribute('data-start')) || 0;
    const startTime = performance.now();

    counter.classList.add('is-running');

    // Smooth easeOutExpo for high-energy start and silky deceleration
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = startVal + (target - startVal) * eased;

      if (decimals > 0) {
        counter.textContent = current.toFixed(decimals);
      } else {
        counter.textContent = Math.round(current).toLocaleString();
      }

      if (progress < 1) {
        counter._rafId = requestAnimationFrame(step);
      } else {
        if (decimals > 0) {
          counter.textContent = target.toFixed(decimals);
        } else {
          counter.textContent = Math.round(target).toLocaleString();
        }
        counter.classList.remove('is-running');
        counter._rafId = null;
      }
    }

    counter._rafId = requestAnimationFrame(step);
  }

  // Setup click-to-replay listeners on parent stat cards or counter elements
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    if (!card._hasCounterClickListener) {
      card._hasCounterClickListener = true;
      card.addEventListener('click', () => {
        card.querySelectorAll('.stat-counter').forEach(c => runCounterAnimation(c));
      });
    }
  });

  // Check if element is currently visible in viewport
  function isVisibleInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < windowHeight * 0.95 && rect.bottom > 0;
  }

  // Use IntersectionObserver to trigger animation when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounterAnimation(entry.target);
        } else {
          // Reset to 0 when scrolled well out of view so next scroll into view runs again smoothly
          const targetStr = (entry.target.getAttribute('data-target') || '0').trim();
          const isDecimal = targetStr.includes('.');
          entry.target.textContent = isDecimal ? '0.0' : '0';
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -20px 0px'
    });

    counters.forEach(counter => {
      observer.observe(counter);
      if (isVisibleInViewport(counter)) {
        setTimeout(() => runCounterAnimation(counter), 100);
      }
    });
  } else {
    // Fallback without IntersectionObserver
    counters.forEach(counter => runCounterAnimation(counter));
  }
}

if (typeof window !== 'undefined') {
  window.initCounters = initCounters;
  window.reRunAllCounters = function() {
    document.querySelectorAll('.stat-counter').forEach(c => {
      if (c._rafId) cancelAnimationFrame(c._rafId);
      const targetStr = (c.getAttribute('data-target') || '0').trim();
      const target = parseFloat(targetStr) || 0;
      const decimals = targetStr.includes('.') ? (targetStr.split('.')[1] || '').length : 0;
      const duration = parseInt(c.getAttribute('data-duration'), 10) || 1800;
      const startTime = performance.now();
      c.classList.add('is-running');
      const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = target * eased;
        c.textContent = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();
        if (progress < 1) {
          c._rafId = requestAnimationFrame(step);
        } else {
          c.textContent = decimals > 0 ? target.toFixed(decimals) : Math.round(target).toLocaleString();
          c.classList.remove('is-running');
          c._rafId = null;
        }
      }
      c._rafId = requestAnimationFrame(step);
    });
  };
}

// ---------------------------------------------------------------------------
// 8. Global Quick Book Modal Trigger & Hero Quick Booking
// ---------------------------------------------------------------------------
function formatLocalDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNextDayDate(dateOrStr) {
  let d;
  if (typeof dateOrStr === 'string' && dateOrStr.includes('-')) {
    const parts = dateOrStr.split('-').map(Number);
    d = new Date(parts[0], parts[1] - 1, parts[2]);
  } else if (dateOrStr instanceof Date) {
    d = new Date(dateOrStr.getFullYear(), dateOrStr.getMonth(), dateOrStr.getDate());
  } else {
    d = new Date();
  }
  d.setDate(d.getDate() + 1);
  return d;
}

function initHeroQuickBookingDates() {
  const checkInInput = document.getElementById('heroQuickCheckIn');
  const checkOutInput = document.getElementById('heroQuickCheckOut');
  
  if (!checkInInput || !checkOutInput) return;

  // 1. Live system/device date for check-in
  const now = new Date();
  const todayStr = formatLocalDate(now);
  
  // 2. Next day date for check-out
  const tomorrow = getNextDayDate(now);
  const tomorrowStr = formatLocalDate(tomorrow);

  // Set initial live values and min constraints
  checkInInput.value = todayStr;
  checkInInput.min = todayStr;

  checkOutInput.value = tomorrowStr;
  checkOutInput.min = tomorrowStr;

  // 3. When Check-in date changes, automatically set Check-out date to next day of check-in
  const handleCheckInChange = () => {
    if (!checkInInput.value) return;
    
    const nextDay = getNextDayDate(checkInInput.value);
    const nextDayStr = formatLocalDate(nextDay);
    
    // Set check-out minimum allowed date to the next day of check-in
    checkOutInput.min = nextDayStr;
    
    // Give the next day date in check-out date
    checkOutInput.value = nextDayStr;
  };

  checkInInput.addEventListener('change', handleCheckInChange);
  checkInInput.addEventListener('input', handleCheckInChange);

  // 4. Ensure Check-out date cannot be on or before check-in date
  checkOutInput.addEventListener('change', () => {
    if (!checkInInput.value || !checkOutInput.value) return;
    
    if (checkOutInput.value <= checkInInput.value) {
      const nextDay = getNextDayDate(checkInInput.value);
      const nextDayStr = formatLocalDate(nextDay);
      checkOutInput.value = nextDayStr;
      if (typeof showToast === 'function') {
        showToast('Check-out date must be at least one day after check-in.', 'info');
      }
    }
  });
}

function submitHeroQuickBooking() {
  const serviceEl = document.getElementById('heroQuickService');
  const petEl = document.getElementById('heroQuickPetGuest');
  const checkInEl = document.getElementById('heroQuickCheckIn');
  const checkOutEl = document.getElementById('heroQuickCheckOut');

  const serviceSlug = serviceEl ? serviceEl.value : 'overnight-boarding';
  
  if (checkInEl && checkInEl.value) {
    sessionStorage.setItem('paws_booking_checkin', checkInEl.value);
  }
  if (checkOutEl && checkOutEl.value) {
    sessionStorage.setItem('paws_booking_checkout', checkOutEl.value);
  }
  if (petEl && petEl.value) {
    sessionStorage.setItem('paws_booking_pet_guest', petEl.value);
  }

  quickBookService(serviceSlug);
}

function quickBookService(serviceSlug) {
  // Store selected service in sessionStorage for prefill
  if (serviceSlug) {
    try { sessionStorage.setItem('paws_booking_preset', serviceSlug); } catch (e) {}
  }
  let activeSession = null;
  let currentUser = null;
  try {
    activeSession = sessionStorage.getItem('paws_logged_in_this_session');
    currentUser = localStorage.getItem('paws_current_user');
  } catch (e) {}
  if (!activeSession || !currentUser) {
    window.location.href = 'login.html?redirect=booking.html';
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
  setTimeout(() => {
    if (document.documentElement.getAttribute('dir') === 'rtl') {
      stabilizeRTLPunctuation();
    }
  }, 300);
  initCounters();
  initHeroQuickBookingDates();
});

// Also initialize immediately if DOM is already ready
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initHeroQuickBookingDates();
  initCounters();
}


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
