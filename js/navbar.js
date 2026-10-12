/**
 * PawsHaven - Unified Navbar Component
 * Renders consistent header, dropdowns, mobile drawer, theme/RTL toggles, and auth state.
 */

// ---------------------------------------------------------------------------
// Input Sanitization & Keydown Prevention Helpers (S-letter safe)
// ---------------------------------------------------------------------------
if (typeof window !== 'undefined') {
  window.sanitizeNoSpace = window.sanitizeNoSpace || function(el) {
    if (!el) return;
    el.value = el.value.replace(/\s+/g, '');
  };

  window.sanitizeNameInput = window.sanitizeNameInput || function(el) {
    if (!el) return;
    el.value = el.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
  };

  window.preventDisallowedSpaces = window.preventDisallowedSpaces || function(event, el, mode) {
    const isSpace = event.key === ' ' || event.code === 'Space' || event.keyCode === 32;
    if (!isSpace) return;
    if (mode === 'none') {
      event.preventDefault();
    } else if (mode === 'single') {
      if (el.selectionStart === 0 || el.value.charAt(el.selectionStart - 1) === ' ') {
        event.preventDefault();
      }
    }
  };
}

const PAW_LOGO_SVG = (sizeClass = "w-6 h-6") => `
  <svg class="${sizeClass} fill-current text-white flex-shrink-0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-label="PawsHaven Logo">
    <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c7.3 19.4-.5 40.7-17.4 50.1l-14.7 8.2c-15.1 8.5-34.1 3.5-42.6-11.6l-50.5-88.8-50.5 88.8c-8.5 15.1-27.5 20.1-42.6 11.6l-14.7-8.2c-16.9-9.4-24.7-30.7-17.4-50.1zM344.2 198.6c-18.9 32.4-14.3 70.1 10.2 84.1s59.7-.9 78.5-33.3 14.3-70.1-10.2-84.1-59.7.9-78.5 33.3zM448.2 92.9c-14.3 42.9.3 86.2 32.6 96.8s70.1-15.6 84.4-58.5-.3-86.2-32.6-96.8-70.1 15.6-84.4 58.5z"/>
  </svg>
`;

function renderPawsNavbar(force = false) {
  const mount = document.getElementById("paws-navbar");
  if (!mount || (mount.dataset.rendered === "true" && !force)) return;
  mount.dataset.rendered = "true";

  // Guarantee Google Fonts for brand are loaded into <head>
  if (!document.getElementById('paws-brand-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'paws-brand-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Quicksand:wght@600;700&family=Outfit:wght@600;700;800&family=Fraunces:opsz,wght@9..144,700;9..144,800&display=swap';
    document.head.appendChild(fontLink);
  }

  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const currentPath = window.location.pathname.toLowerCase();

  const isCurrent = (name) => {
    if (name === 'home' || name === 'index.html') {
      return currentPath.endsWith('/index.html') || currentPath.endsWith('/') || currentPath.endsWith('/home2.html') || currentPath === '';
    }
    return currentPath.includes(name.toLowerCase());
  };

  const navClass = (name) => {
    const active = isCurrent(name);
    return active
      ? "h-10 px-2 xl:px-3 text-xs xl:text-sm font-bold text-[var(--brand-primary)] bg-[var(--bg-subtle)] rounded-xl transition inline-flex items-center justify-center gap-1 xl:gap-1.5 whitespace-nowrap flex-shrink-0 leading-none"
      : "h-10 px-2 xl:px-3 text-xs xl:text-sm font-semibold text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-subtle)] rounded-xl transition inline-flex items-center justify-center gap-1 xl:gap-1.5 whitespace-nowrap flex-shrink-0 leading-none";
  };

  const drawerNavClass = (name) => {
    const active = isCurrent(name);
    return active
      ? "paws-drawer-link active"
      : "paws-drawer-link";
  };

  let authButtonsHtml = '';
  if (currentUser) {
    authButtonsHtml = `
      <div id="userProfileWrapper" class="relative flex-shrink-0 h-10 flex items-center">
        <button type="button" id="userProfileBtn" onclick="toggleProfileDropdown(event)" aria-haspopup="true" aria-expanded="false" title="Account: ${currentUser.name}" class="h-10 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] transition border border-[var(--border-color)] cursor-pointer whitespace-nowrap flex-shrink-0 leading-none">
          <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}" alt="${currentUser.name}" class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-white shadow-xs pointer-events-none flex-shrink-0">
          <span class="text-xs font-bold text-[var(--text-main)] hidden xl:inline-block pointer-events-none leading-none max-w-[100px] truncate">${currentUser.name}</span>
          <i id="userProfileChevron" class="bi bi-chevron-down text-[10px] opacity-60 transition-transform duration-200 pointer-events-none leading-none flex items-center"></i>
        </button>

        <!-- Profile Dropdown Menu Directly Below -->
        <div id="userProfileDropdown" class="absolute right-0 top-full mt-2 w-48 sm:w-52 py-1.5 bg-[var(--bg-surface)] rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.55)] border border-[var(--border-color)] hidden z-50 transition-all duration-150 transform origin-top-right">
          <button type="button" onclick="handleAddAnotherAccount(event)" class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-subtle)] transition rounded-xl text-left cursor-pointer">
            <i class="bi bi-person-plus text-sm text-[var(--brand-primary)] leading-none"></i>
            <span>Add another account</span>
          </button>
          <div class="h-px bg-[var(--border-color)] my-1 mx-2"></div>
          <button type="button" onclick="handleSignOut(event)" class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition rounded-xl text-left cursor-pointer">
            <i class="bi bi-box-arrow-right text-sm leading-none"></i>
            <span>Sign out</span>
          </button>
        </div>
      </div>
      <a href="booking.html" id="headerBookStayBtn" class="hidden sm:inline-flex h-10 btn-brand-accent text-xs font-bold px-2.5 xl:px-4 rounded-xl items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition cursor-pointer whitespace-nowrap flex-shrink-0 leading-none" title="Book Stay">
        <i class="bi bi-calendar-heart text-xs leading-none flex items-center"></i>
        <span>Book Stay</span>
      </a>
    `;
  } else {
    const isLoginPage = currentPath.endsWith('login.html');
    authButtonsHtml = `
      <a href="login.html" id="headerLoginBtn" title="Log In" aria-label="Log In" class="h-10 px-2.5 xl:px-4 rounded-xl border ${isLoginPage ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--bg-subtle)]' : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-[var(--text-main)]'} text-xs font-bold transition inline-flex items-center justify-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0 leading-none">
        <i class="bi bi-box-arrow-in-right text-sm leading-none flex items-center"></i>
        <span>Log In</span>
      </a>
      <a href="booking.html" id="headerBookStayBtn" class="hidden sm:inline-flex h-10 btn-brand-accent text-xs font-bold px-2.5 xl:px-4 rounded-xl items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition cursor-pointer whitespace-nowrap flex-shrink-0 leading-none" title="Book Stay">
        <i class="bi bi-calendar-heart text-xs leading-none flex items-center"></i>
        <span>Book Stay</span>
      </a>
    `;
  }

  mount.innerHTML = `
    <header class="fixed top-0 left-0 w-full z-50 paws-navbar-header bg-[var(--bg-surface)] border-b border-[var(--border-color)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300" style="background-color: var(--bg-surface);">
      <div class="paws-navbar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-8 h-20 flex items-center justify-between gap-1.5 lg:gap-2 xl:gap-4">
        
        <!-- Left Column: Brand Logo (Uniform h-10 container & alignment) -->
        <div class="flex items-center flex-shrink-0 h-10">
          <a href="index.html" class="paws-brand-link flex items-center gap-2.5 sm:gap-3 group h-10">
            <div class="w-10 h-10 rounded-xl bg-[#F0F1EC] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden border border-[var(--border-color)] flex-shrink-0">
              <img src="images/logo.png" alt="PawsHaven Resort Logo" class="w-full h-full object-cover block">
            </div>
            <div class="flex flex-col justify-center h-10">
              <span class="paws-brand-title whitespace-nowrap" style="font-family: 'Outfit', -apple-system, sans-serif !important; font-size: 1.35rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1;">
                <span class="brand-paws text-[var(--brand-primary)] dark:text-emerald-400">Paws</span><span class="brand-haven text-[var(--brand-accent)]">Haven</span>
              </span>
              <span class="paws-brand-subtitle whitespace-nowrap" style="font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif !important; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--text-muted); margin-top: 0.1rem;">
                Resort &amp; Daycare
              </span>
            </div>
          </a>
        </div>

        <!-- Center Column: Desktop Navigation Links (Uniform h-10 Centered, Responsive 1024px Spacing) -->
        <nav class="paws-desktop-nav hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 flex-1 mx-1 xl:mx-3 h-10">
          <!-- Home Dropdown -->
          <div class="paws-dropdown-wrapper relative group flex-shrink-0 h-10 flex items-center">
            <button class="${navClass('home')} cursor-pointer">
              <span>Home</span>
              <i class="bi bi-chevron-down text-[10px] opacity-60 group-hover:rotate-180 transition-transform duration-200 leading-none flex items-center"></i>
            </button>
            <div class="paws-dropdown-menu absolute left-0 top-full pt-1.5 w-56 hidden group-hover:block z-50">
              <div class="bg-[var(--bg-surface)] rounded-2xl shadow-xl border border-[var(--border-color)] py-2 animate-fadeIn">
                <a href="index.html" class="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--bg-subtle)] transition">
                  <i class="bi bi-house-heart text-[var(--brand-accent)] text-base mt-0.5 leading-none"></i>
                  <div>
                    <div class="text-xs font-bold text-[var(--text-main)]">Home 1 - Resort</div>
                    <div class="text-[11px] text-[var(--text-muted)]">Luxury Boarding & Daycare</div>
                  </div>
                </a>
                <a href="home2.html" class="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--bg-subtle)] transition">
                  <i class="bi bi-cpu text-[var(--brand-primary)] text-base mt-0.5 leading-none"></i>
                  <div>
                    <div class="text-xs font-bold text-[var(--text-main)]">Home 2 - Platform</div>
                    <div class="text-[11px] text-[var(--text-muted)]">Modern Pet Care SaaS</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <a href="about.html" class="${navClass('about.html')}">
            About
          </a>

          <a href="services.html" class="${navClass('services')}">
            Services
          </a>

          <a href="facilities.html" class="${navClass('facilities.html')}">
            Facilities
          </a>

          <a href="pricing.html" class="${navClass('pricing.html')}">
            Pricing
          </a>

          <a href="blog.html" class="${navClass('blog')}">
            Blog
          </a>

          <a href="contact.html" class="${navClass('contact.html')}">
            Contact
          </a>

          <a href="user.html" class="${navClass('user.html')}">
            Dashboard
          </a>
        </nav>

        <!-- Right Column: Utility Controls, Auth & CTAs (Uniform h-10) -->
        <div class="paws-nav-right flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 flex-shrink-0 h-10">
          <!-- Utility Controls: Theme & RTL Toggles (Hidden when screen is too small to display) -->
          <div class="paws-util-pill hidden lg:inline-flex h-10 items-center p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] gap-1 flex-shrink-0 box-border">
            <button onclick="toggleTheme()" class="btn-theme-toggle w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition cursor-pointer leading-none" title="Toggle Light/Dark Theme">
              <i class="theme-toggle-icon bi bi-moon-stars-fill text-xs text-amber-500 leading-none flex items-center justify-center"></i>
            </button>
            <button onclick="toggleRTL()" class="btn-rtl-toggle w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition text-xs font-bold cursor-pointer leading-none" title="Toggle RTL / LTR Direction">
              <span class="leading-none flex items-center justify-center">⇄</span>
            </button>
          </div>

          <!-- Divider (Hidden when screen is too small to display) -->
          <div class="paws-nav-divider hidden lg:block h-6 w-px bg-[var(--border-color)] mx-0.5 xl:mx-1 flex-shrink-0 self-center"></div>

          <!-- Auth & CTA Buttons / Login Container (Removed when screen is too small to display) -->
          <div id="pawsLoginContainer" class="paws-auth-cluster paws-login-container hidden lg:flex items-center gap-1.5 xl:gap-2 flex-shrink-0 h-10">
            ${authButtonsHtml}
          </div>

          <!-- Mobile Hamburger Menu Button (☰) -->
          <button id="mobileMenuBtn" type="button" class="paws-mobile-menu-btn lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-normal text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-subtle)] transition border border-[var(--border-color)] cursor-pointer flex-shrink-0 leading-none select-none" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileDrawer">
            <span class="paws-hamburger-icon select-none" aria-hidden="true">☰</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Drawer & Backdrop -->
    <div id="mobileDrawerOverlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] hidden opacity-0 transition-opacity duration-300"></div>

    <aside id="mobileDrawer" class="fixed top-0 right-0 w-80 max-w-[88vw] h-full bg-[var(--bg-surface)] text-[var(--text-main)] z-[100] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col border-s border-[var(--border-color)] overflow-hidden">
      
      <!-- Drawer Header: Brand Logo & Full Brand Name (Clearly visible, never clipped) + Close Button -->
      <div class="paws-drawer-header flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex-shrink-0">
        <a href="index.html" class="paws-drawer-brand flex items-center gap-2.5 min-w-0 flex-1 mr-2 no-underline group">
          <div class="paws-drawer-logo rounded-xl bg-[#F0F1EC] flex items-center justify-center shadow-xs overflow-hidden border border-[var(--border-color)] flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            <img src="images/logo.png" alt="PawsHaven Resort Logo" class="w-full h-full object-cover block">
          </div>
          <div class="paws-drawer-brand-text flex flex-col justify-center min-w-0 flex-1">
            <span class="paws-drawer-brand-title paws-brand-title whitespace-nowrap leading-tight">
              <span class="brand-paws text-[var(--brand-primary)] dark:text-emerald-400">Paws</span><span class="brand-haven text-[var(--brand-accent)]">Haven</span>
            </span>
            <span class="paws-drawer-brand-subtitle paws-brand-subtitle uppercase whitespace-nowrap">
              Resort &amp; Daycare
            </span>
          </div>
        </a>
        <button id="closeDrawerBtn" type="button" class="flex items-center justify-center text-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition cursor-pointer flex-shrink-0" aria-label="Close navigation menu">
          <i class="bi bi-x-lg text-xs sm:text-sm"></i>
        </button>
      </div>

      <!-- Simple Preferences Bar: Theme Mode & RTL/LTR Symbols -->
      <div class="px-3.5 sm:px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]/40 flex items-center justify-between flex-shrink-0">
        <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Preferences</span>
        <div class="inline-flex items-center p-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] gap-1 box-border shadow-2xs">
          <button type="button" onclick="toggleTheme()" class="btn-theme-toggle w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition cursor-pointer leading-none" title="Toggle Light/Dark Theme" aria-label="Toggle Light/Dark Theme">
            <i class="theme-toggle-icon bi bi-moon-stars-fill text-xs text-amber-500 leading-none flex items-center justify-center"></i>
          </button>
          <button type="button" onclick="toggleRTL()" class="btn-rtl-toggle w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition text-xs font-bold cursor-pointer leading-none" title="Toggle RTL / LTR Direction" aria-label="Toggle RTL / LTR Direction">
            <span class="leading-none flex items-center justify-center font-bold text-xs">⇄</span>
          </button>
        </div>
      </div>

      <!-- Drawer Content: Properly Sized & Aligned Navigation Links -->
      <div class="paws-drawer-nav flex-1 overflow-y-auto">
        <div class="paws-drawer-heading">Navigation</div>
        
        <a href="index.html" class="${drawerNavClass('home')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-house-heart text-[var(--brand-accent)]"></i>
            </span>
            <span class="paws-drawer-label truncate">Home 1 - Resort</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>

        <a href="home2.html" class="${drawerNavClass('home2.html')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-cpu text-[var(--brand-primary)] dark:text-emerald-400"></i>
            </span>
            <span class="paws-drawer-label truncate">Home 2 - Platform</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>

        <a href="about.html" class="${drawerNavClass('about.html')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-info-circle text-[var(--brand-primary)]"></i>
            </span>
            <span class="paws-drawer-label truncate">About Us</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>

        <a href="services.html" class="${drawerNavClass('services')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-stars text-amber-500"></i>
            </span>
            <span class="paws-drawer-label truncate">Our Services</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>

        <a href="facilities.html" class="${drawerNavClass('facilities.html')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-building text-[var(--brand-secondary)]"></i>
            </span>
            <span class="paws-drawer-label truncate">Facilities &amp; Suites</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>

        <a href="pricing.html" class="${drawerNavClass('pricing.html')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-tag text-[var(--brand-accent)]"></i>
            </span>
            <span class="paws-drawer-label truncate">Rates &amp; Packages</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>

        <!-- Book a Stay CTA Link inside hamburger menu list -->
        <a href="booking.html" id="drawerNavBookStay" class="${drawerNavClass('booking.html')} paws-drawer-link-book">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-calendar-heart text-[var(--brand-accent)]"></i>
            </span>
            <span class="paws-drawer-label truncate font-bold text-[var(--brand-accent)] dark:text-[#ff9d82]">Book a Stay</span>
          </span>
          <span class="flex items-center gap-1.5 flex-shrink-0">
            <span class="paws-drawer-badge text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[var(--brand-accent)] text-white leading-none">Book</span>
            <i class="paws-drawer-arrow bi bi-chevron-right text-[var(--brand-accent)]"></i>
          </span>
        </a>

        <a href="blog.html" class="${drawerNavClass('blog')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-journal-text text-[var(--brand-primary)]"></i>
            </span>
            <span class="paws-drawer-label truncate">Pet Care Articles</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>

        <a href="contact.html" class="${drawerNavClass('contact.html')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-geo-alt text-rose-500"></i>
            </span>
            <span class="paws-drawer-label truncate">Contact &amp; Location</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>

        <a href="user.html" class="${drawerNavClass('user.html')}">
          <span class="flex items-center gap-2.5 min-w-0">
            <span class="paws-drawer-icon">
              <i class="bi bi-speedometer2 text-[var(--brand-primary)]"></i>
            </span>
            <span class="paws-drawer-label truncate">Pet Parent Portal</span>
          </span>
          <i class="paws-drawer-arrow bi bi-chevron-right"></i>
        </a>
      </div>

      <!-- Drawer Footer Actions -->
      <div class="paws-drawer-footer">
        <div class="flex flex-col gap-2">
          <!-- Primary Book a Stay CTA Button (Always displayed in drawer for instant access) -->
          <a href="booking.html" id="drawerFooterBookStayBtn" class="paws-drawer-btn-book w-full px-3 btn-brand-accent text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition hover:shadow-md cursor-pointer whitespace-nowrap">
            <i class="bi bi-calendar-heart text-sm"></i>
            <span>Book a Stay</span>
          </a>

          ${currentUser ? `
            <a href="user.html" class="paws-drawer-btn-account w-full px-3 border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)] text-xs font-bold text-center flex items-center justify-center gap-2 text-[var(--text-main)] shadow-xs whitespace-nowrap truncate">
              <i class="bi bi-person-circle text-sm flex-shrink-0"></i>
              <span class="truncate">My Account (${currentUser.name})</span>
            </a>
            <button type="button" onclick="handleSignOut(event)" class="paws-drawer-btn-signout w-full px-3 border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold text-center cursor-pointer transition flex items-center justify-center gap-2 whitespace-nowrap">
              <i class="bi bi-box-arrow-right text-sm"></i>
              <span>Sign Out</span>
            </button>
          ` : `
            <div class="flex items-center gap-2 w-full">
              <!-- Log In CTA -->
              <a href="login.html" class="paws-drawer-btn-login flex-1 px-3 border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-xs font-bold text-center flex items-center justify-center gap-1.5 transition text-[var(--text-main)] shadow-xs whitespace-nowrap">
                <i class="bi bi-box-arrow-in-right text-sm"></i>
                <span>Log In</span>
              </a>
              <!-- Sign Up CTA -->
              <a href="register.html" class="paws-drawer-btn-signup flex-1 px-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition shadow-sm whitespace-nowrap">
                <i class="bi bi-person-plus text-sm"></i>
                <span>Sign Up</span>
              </a>
            </div>
          `}
        </div>
      </div>
    </aside>

    <!-- Auth Hovering Modal & Blurred Backdrop Overlay -->
    <div id="pawsAuthModalOverlay" class="auth-modal-overlay" onclick="handleAuthOverlayClick(event)">
      <div id="pawsAuthModalCard" class="auth-modal-card" onclick="event.stopPropagation()">
        
        <!-- Close Button -->
        <button type="button" onclick="closeAuthModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center transition shadow-sm z-20" title="Close dialog (Esc)">
          <i class="bi bi-x-lg text-sm"></i>
        </button>

        <!-- Modal Header -->
        <div class="text-center mb-5">
          <div id="authModalIcon" class="w-14 h-14 rounded-2xl bg-[#F0F1EC] dark:bg-[#1a2e26] flex items-center justify-center shadow-md mx-auto mb-2.5 overflow-hidden border border-[var(--border-color)] transition-all">
            <img src="images/logo.png" alt="PawsHaven Resort Logo" class="w-full h-full object-cover block">
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="paws-brand-title whitespace-nowrap" style="font-family: 'Outfit', -apple-system, sans-serif !important; font-size: 1.45rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.15;">
              <span class="brand-paws text-[var(--brand-primary)] dark:text-emerald-400">Paws</span><span class="brand-haven text-[var(--brand-accent)]">Haven</span>
            </span>
            <span class="paws-brand-subtitle whitespace-nowrap" style="font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif !important; font-size: 0.625rem; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--text-muted); margin-top: 0.16rem;">
              Resort &amp; Daycare
            </span>
          </div>
          <h3 id="authModalTitle" class="text-sm font-bold text-[var(--text-main)] mt-2">Welcome to Pet Parent Portal</h3>
          <p id="authModalSubtitle" class="text-xs text-[var(--text-muted)] mt-0.5">Access your pet parent portal &amp; reservations</p>
        </div>

        <!-- View 1: Login -->
        <div id="authModalLoginView">
          <!-- Login Form -->
          <form id="modalLoginForm" onsubmit="event.preventDefault(); handleModalLogin();" class="space-y-3.5 text-xs">
            <div>
              <label for="modalLoginId" class="block font-bold text-[var(--text-muted)] mb-1">Email or Username <span class="text-rose-500">*</span></label>
              <div class="relative">
                <i class="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                <input type="text" id="modalLoginId" required placeholder="user@gmail.com" onkeydown="preventDisallowedSpaces(event, this, 'none')" oninput="sanitizeNoSpace(this)" class="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="modalLoginPassword" class="block font-bold text-[var(--text-muted)]">Password <span class="text-rose-500">*</span></label>
                <button type="button" onclick="switchAuthTab('forgot')" class="text-[11px] font-bold text-[var(--brand-accent)] hover:underline focus:outline-none cursor-pointer">Forgot password?</button>
              </div>
              <div class="relative">
                <i class="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                <input type="password" id="modalLoginPassword" required placeholder="••••••••" onkeydown="preventDisallowedSpaces(event, this, 'none')" oninput="sanitizeNoSpace(this)" class="w-full ps-10 pe-10 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
                <button type="button" onclick="togglePasswordVisibility('modalLoginPassword', this)" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition cursor-pointer" title="Toggle password visibility">
                  <i class="bi bi-eye text-sm"></i>
                </button>
              </div>
            </div>

            <button type="submit" id="modalLoginBtn" class="btn-brand-primary w-full py-3.5 rounded-xl font-bold text-xs shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer">
              <span>Log In as Pet Owner</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </form>

          <div class="text-center pt-3.5 mt-3.5 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
            Don't have an account? <a href="register.html" onclick="closeAuthModal()" class="font-bold text-[var(--brand-primary)] hover:underline cursor-pointer">Register Pet Profile</a>
          </div>
        </div>

        <!-- View 3: Forgot Password -->
        <div id="authModalForgotView" class="hidden">
          <div class="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div class="flex items-start gap-2.5">
              <i class="bi bi-shield-lock-fill text-[var(--brand-accent)] text-lg mt-0.5 flex-shrink-0"></i>
              <div>
                <p class="font-bold text-[var(--text-main)]">Password Recovery</p>
                <p class="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">Enter your registered email or username below. We'll verify your profile and help you set a new secure password.</p>
              </div>
            </div>
          </div>

          <!-- Step 1: Email Form -->
          <form id="modalForgotForm" onsubmit="event.preventDefault(); handleModalForgotSubmit();" class="space-y-3.5 text-xs">
            <div>
              <label for="modalForgotEmail" class="block font-bold text-[var(--text-muted)] mb-1">Email Address or Username <span class="text-rose-500">*</span></label>
              <div class="relative">
                <i class="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                <input type="text" id="modalForgotEmail" required placeholder="user@gmail.com" onkeydown="preventDisallowedSpaces(event, this, 'none')" oninput="sanitizeNoSpace(this)" class="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
            </div>

            <button type="submit" id="modalForgotBtn" class="btn-brand-accent w-full py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer">
              <i class="bi bi-key-fill"></i>
              <span>Verify &amp; Reset Password</span>
            </button>
          </form>

          <!-- Step 2: New Password Form -->
          <div id="modalResetPasswordBox" class="hidden mt-4 pt-4 border-t border-[var(--border-color)] space-y-3 text-xs">
            <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2 font-medium">
              <i class="bi bi-check-circle-fill text-emerald-600 dark:text-emerald-400 flex-shrink-0 text-sm"></i>
              <span id="modalResetAccountLabel">Account verified! Set your new password:</span>
            </div>

            <div>
              <label for="modalNewPassword" class="block font-bold text-[var(--text-muted)] mb-1">New Password <span class="text-rose-500">*</span></label>
              <div class="relative">
                <i class="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                <input type="password" id="modalNewPassword" placeholder="Minimum 4 characters" onkeydown="preventDisallowedSpaces(event, this, 'none')" oninput="sanitizeNoSpace(this)" class="w-full ps-10 pe-10 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
                <button type="button" onclick="togglePasswordVisibility('modalNewPassword', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">
                  <i class="bi bi-eye text-sm"></i>
                </button>
              </div>
            </div>

            <div>
              <label for="modalConfirmPassword" class="block font-bold text-[var(--text-muted)] mb-1">Confirm New Password <span class="text-rose-500">*</span></label>
              <div class="relative">
                <i class="bi bi-shield-check absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                <input type="password" id="modalConfirmPassword" placeholder="Re-enter new password" onkeydown="preventDisallowedSpaces(event, this, 'none')" oninput="sanitizeNoSpace(this)" class="w-full ps-10 pe-10 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
                <button type="button" onclick="togglePasswordVisibility('modalConfirmPassword', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">
                  <i class="bi bi-eye text-sm"></i>
                </button>
              </div>
            </div>

            <button type="button" onclick="handleModalResetPassword()" class="btn-brand-primary w-full py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer">
              <i class="bi bi-check2-circle text-sm"></i>
              <span>Save Password &amp; Log In</span>
            </button>
          </div>

          <div class="text-center pt-3.5 mt-3.5 border-t border-[var(--border-color)] text-xs">
            <button type="button" onclick="switchAuthTab('login')" class="font-bold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1.5 cursor-pointer">
              <i class="bi bi-arrow-left"></i>
              <span>Back to Sign In</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Drawer open / close / toggle state & handlers
  let isDrawerOpen = false;
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("mobileDrawerOverlay");

  function openDrawer(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isDrawerOpen = true;
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-expanded", "true");
    }
    if (overlay) {
      overlay.classList.remove("hidden");
    }
    if (drawer) {
      drawer.classList.remove("hidden");
    }
    requestAnimationFrame(() => {
      if (overlay) overlay.classList.remove("opacity-0");
      if (drawer) {
        drawer.classList.remove("translate-x-full");
        drawer.classList.add("active");
      }
    });
    document.body.style.overflow = "hidden";
  }

  function closeDrawer(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isDrawerOpen = false;
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    }
    if (overlay) overlay.classList.add("opacity-0");
    if (drawer) {
      drawer.classList.add("translate-x-full");
      drawer.classList.remove("active");
    }
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!isDrawerOpen) {
        if (overlay) overlay.classList.add("hidden");
      }
    }, 300);
  }

  function toggleDrawer(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  window.openMobileDrawer = openDrawer;
  window.closeMobileDrawer = closeDrawer;
  window.toggleMobileDrawer = toggleDrawer;

  if (mobileMenuBtn) {
    mobileMenuBtn.onclick = toggleDrawer;
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.onclick = closeDrawer;
  }
  if (overlay) {
    overlay.onclick = closeDrawer;
  }

  // Close when selecting ANY navigation link or action button inside the drawer (except theme & RTL toggles)
  if (drawer) {
    drawer.addEventListener("click", (e) => {
      const clickable = e.target.closest("a, button");
      if (clickable && clickable.id !== "closeDrawerBtn" && !clickable.classList.contains("btn-theme-toggle") && !clickable.classList.contains("btn-rtl-toggle")) {
        closeDrawer();
      }
    });
  }

  // Close when clicking anywhere outside the drawer
  document.addEventListener("click", (e) => {
    if (!isDrawerOpen) return;
    const currentDrawer = document.getElementById("mobileDrawer");
    const currentBtn = document.getElementById("mobileMenuBtn");
    if (currentDrawer && !currentDrawer.contains(e.target) && (!currentBtn || !currentBtn.contains(e.target))) {
      closeDrawer();
    }
  });

  // Automatically close drawer and restore navigation when screen width increases to desktop (>= 1024px)
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && isDrawerOpen) {
      closeDrawer();
    }
  });

  // Relocate auth modal overlay directly to document.body so navbar and whole page can be blurred behind it
  const authModalEl = document.getElementById('pawsAuthModalOverlay');
  if (authModalEl && authModalEl.parentElement !== document.body) {
    document.body.appendChild(authModalEl);
  }
}

// Immediate rendering for zero flicker, with DOMContentLoaded fallback
if (document.getElementById('paws-navbar')) {
  renderPawsNavbar();
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPawsNavbar);
} else {
  renderPawsNavbar();
}

// ---------------------------------------------------------------------------
// Global Auth Modal Controller & Event Handlers
// ---------------------------------------------------------------------------
let _authModalRedirect = '';

function openAuthModal(mode = 'login', redirectTarget = '') {
  if (mode === 'register') {
    window.location.href = 'register.html';
    return;
  }
  if (mode === 'forgot') {
    window.location.href = 'login.html?tab=forgot';
    return;
  }
  const redirectQuery = redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : '';
  window.location.href = `login.html${redirectQuery}`;
}

function closeAuthModal() {
  const overlay = document.getElementById('pawsAuthModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
  document.body.classList.remove('auth-modal-open');
  document.body.style.overflow = '';
}

function handleAuthOverlayClick(e) {
  if (e.target.id === 'pawsAuthModalOverlay') {
    closeAuthModal();
  }
}

let _pendingResetUserEmail = '';

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  const icon = btn ? btn.querySelector('i') : null;
  if (icon) {
    icon.className = isPass ? 'bi bi-eye-slash text-sm' : 'bi bi-eye text-sm';
  }
}

function switchAuthTab(mode) {
  if (mode === 'register') {
    closeAuthModal();
    window.location.href = 'register.html';
    return;
  }

  const viewLogin = document.getElementById('authModalLoginView');
  const viewForgot = document.getElementById('authModalForgotView');
  const modalIcon = document.getElementById('authModalIcon');
  const modalTitle = document.getElementById('authModalTitle');
  const modalSubtitle = document.getElementById('authModalSubtitle');

  // Guarantee official brand logo stays visible in header across all tabs
  if (modalIcon) {
    modalIcon.className = 'w-14 h-14 rounded-2xl bg-[#F0F1EC] dark:bg-[#1a2e26] flex items-center justify-center shadow-md mx-auto mb-2.5 overflow-hidden border border-[var(--border-color)] transition-all';
    modalIcon.innerHTML = '<img src="images/logo.png" alt="PawsHaven Resort Logo" class="w-full h-full object-cover block">';
  }

  if (mode === 'forgot') {
    if (viewLogin) viewLogin.classList.add('hidden');
    if (viewForgot) viewForgot.classList.remove('hidden');
    if (modalTitle) modalTitle.innerText = 'Password Recovery';
    if (modalSubtitle) modalSubtitle.innerText = 'Recover access to your pet parent account';
    
    // Reset state in forgot password form
    const resetBox = document.getElementById('modalResetPasswordBox');
    if (resetBox) resetBox.classList.add('hidden');
    const newPass = document.getElementById('modalNewPassword');
    if (newPass) newPass.value = '';
    const confirmPass = document.getElementById('modalConfirmPassword');
    if (confirmPass) confirmPass.value = '';
    setTimeout(() => { const el = document.getElementById('modalForgotEmail'); if (el) el.focus(); }, 100);
  } else {
    // Default: 'login'
    if (viewLogin) viewLogin.classList.remove('hidden');
    if (viewForgot) viewForgot.classList.add('hidden');
    if (modalTitle) modalTitle.innerText = 'Welcome to Pet Parent Portal';
    if (modalSubtitle) modalSubtitle.innerText = 'Access your pet parent portal & reservations';
    setTimeout(() => { const el = document.getElementById('modalLoginId'); if (el) el.focus(); }, 100);
  }
}

function handleModalForgotSubmit() {
  const input = document.getElementById('modalForgotEmail') ? document.getElementById('modalForgotEmail').value.trim() : '';
  if (!input) {
    if (typeof showToast === 'function') showToast('Please enter your registered email or username.', 'error');
    return;
  }

  const cleanInput = input.toLowerCase();
  const users = JSON.parse(localStorage.getItem('paws_users') || '[]');
  let matchedUser = users.find(u => 
    (u.email && u.email.toLowerCase() === cleanInput) ||
    (u.id && u.id.toLowerCase() === cleanInput) ||
    (cleanInput === 'user' && (u.email === 'user@gmail.com' || u.id === 'usr-01'))
  );

  if (!matchedUser && (cleanInput === 'user@gmail.com' || cleanInput === 'user')) {
    if (typeof PawsData !== 'undefined' && PawsData.users && PawsData.users.length > 0) {
      matchedUser = PawsData.users[0];
    }
  }

  _pendingResetUserEmail = matchedUser ? (matchedUser.email || cleanInput) : cleanInput;
  const resetBox = document.getElementById('modalResetPasswordBox');
  const resetLabel = document.getElementById('modalResetAccountLabel');
  
  if (resetBox) resetBox.classList.remove('hidden');
  if (resetLabel) {
    const displayName = matchedUser ? matchedUser.name : cleanInput;
    resetLabel.innerHTML = `Account verified for <strong>${displayName}</strong>! Enter new password:`;
  }
  
  if (typeof showToast === 'function') {
    showToast(`Verification code sent for ${_pendingResetUserEmail}. Enter your new password below.`, 'success', 3500);
  }
  
  const newPassInput = document.getElementById('modalNewPassword');
  if (newPassInput) newPassInput.focus();
}

function handleModalResetPassword() {
  const newPass = document.getElementById('modalNewPassword') ? document.getElementById('modalNewPassword').value : '';
  const confirmPass = document.getElementById('modalConfirmPassword') ? document.getElementById('modalConfirmPassword').value : '';

  if (!newPass) {
    if (typeof showToast === 'function') showToast('Please enter your new password.', 'error');
    return;
  }
  if (newPass.length < 4) {
    if (typeof showToast === 'function') showToast('Password must be at least 4 characters.', 'error');
    return;
  }
  if (newPass !== confirmPass) {
    if (typeof showToast === 'function') showToast('Passwords do not match. Please verify.', 'error');
    return;
  }

  const targetEmail = (_pendingResetUserEmail || 'user@gmail.com').toLowerCase();
  let users = JSON.parse(localStorage.getItem('paws_users') || '[]');
  let found = false;

  users = users.map(u => {
    if ((u.email && u.email.toLowerCase() === targetEmail) || (u.id && u.id.toLowerCase() === targetEmail) || (targetEmail === 'user@gmail.com' && u.email === 'user@gmail.com')) {
      found = true;
      return { ...u, password: newPass };
    }
    return u;
  });

  if (!found) {
    users.push({
      id: 'usr-01',
      name: 'Rachel Adams',
      email: targetEmail.includes('@') ? targetEmail : `${targetEmail}@gmail.com`,
      password: newPass,
      phone: '+1(555)234-5678',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'Today'
    });
  }

  localStorage.setItem('paws_users', JSON.stringify(users));

  if (typeof showToast === 'function') {
    showToast('🎉 Password reset successfully! Logging in with your new credentials...', 'success', 3500);
  }

  // Auto switch back to login with new password and authenticate
  switchAuthTab('login');
  const loginIdInput = document.getElementById('modalLoginId');
  const loginPassInput = document.getElementById('modalLoginPassword');
  if (loginIdInput) loginIdInput.value = targetEmail;
  if (loginPassInput) loginPassInput.value = newPass;

  setTimeout(() => {
    handleModalLogin();
  }, 600);
}

function modalFillDemoId(id) {
  const input = document.getElementById('modalLoginId');
  if (input) {
    input.value = id;
    input.focus();
    if (typeof showToast === 'function') {
      showToast(`Selected demo ID: ${id}`, 'info', 2000);
    }
  }
}

function handleModalLogin() {
  const rawInput = document.getElementById('modalLoginId') ? document.getElementById('modalLoginId').value.trim() : '';
  const passwordInput = document.getElementById('modalLoginPassword') ? document.getElementById('modalLoginPassword').value : '';

  if (!rawInput || !passwordInput) {
    if (typeof showToast === 'function') showToast('Please enter both email/username and password.', 'error');
    return;
  }

  const input = rawInput.toLowerCase();
  const users = JSON.parse(localStorage.getItem('paws_users') || '[]');
  let user = users.find(u => 
    (u.email && u.email.toLowerCase() === input) ||
    (u.id && u.id.toLowerCase() === input) ||
    (input === 'user' && (u.email === 'user@gmail.com' || u.id === 'usr-01'))
  );

  if (!user && (input === 'user@gmail.com' || input === 'user')) {
    if (typeof PawsData !== 'undefined' && PawsData.users && PawsData.users.length > 0) {
      user = PawsData.users[0];
    }
  }

  const isSpecialMatch = (input === 'user@gmail.com' || input === 'user' || input === 'usr-01') && passwordInput === '1234';
  const isPasswordMatch = user && (user.password === passwordInput || isSpecialMatch);

  if (user && isPasswordMatch) {
    setCurrentUser(user);
    closeAuthModal();
    if (typeof showToast === 'function') {
      showToast(`Welcome back, ${user.name}! Access granted.`, 'success', 3000);
    }
    
    setTimeout(() => {
      if (_authModalRedirect && (_authModalRedirect.includes('.html') || _authModalRedirect.includes('booking')) && !_authModalRedirect.includes('user.html') && !_authModalRedirect.toLowerCase().includes('dashboard')) {
        window.location.href = _authModalRedirect;
      } else if (window.location.pathname.includes('booking.html')) {
        window.location.reload();
      } else {
        window.location.href = 'index.html';
      }
    }, 600);
  } else {
    if (typeof showToast === 'function') {
      showToast('Invalid credentials. Please enter a valid email and password.', 'error');
    }
  }
}

function handleModalRegister() {
  const name = document.getElementById('modalRegName').value.trim();
  const phone = document.getElementById('modalRegPhone').value.trim();
  const email = document.getElementById('modalRegEmail').value.trim().toLowerCase();
  const password = document.getElementById('modalRegPassword').value;
  const petName = document.getElementById('modalRegPetName').value.trim();
  const species = document.getElementById('modalRegPetSpecies').value;
  const petBreed = document.getElementById('modalRegPetBreed') ? document.getElementById('modalRegPetBreed').value.trim() : '';
  const petAge = document.getElementById('modalRegPetAge') ? document.getElementById('modalRegPetAge').value.trim() : 'Adult';
  const petWeight = document.getElementById('modalRegPetWeight') ? document.getElementById('modalRegPetWeight').value.trim() : 'Medium';

  if (!name || !phone || !email || !password || !petName) {
    if (typeof showToast === 'function') showToast('Please fill out all required fields.', 'error');
    return;
  }

  if (phone.includes(' ')) {
    if (typeof showToast === 'function') showToast('Phone number cannot contain spaces.', 'error');
    const phoneInput = document.getElementById('modalRegPhone');
    if (phoneInput) phoneInput.focus();
    return;
  }

  if (email.includes(' ')) {
    if (typeof showToast === 'function') showToast('Email address cannot contain spaces.', 'error');
    const emailInput = document.getElementById('modalRegEmail');
    if (emailInput) emailInput.focus();
    return;
  }

  if (password.includes(' ')) {
    if (typeof showToast === 'function') showToast('Password cannot contain spaces.', 'error');
    const passInput = document.getElementById('modalRegPassword');
    if (passInput) passInput.focus();
    return;
  }

  // Validate phone: must contain digits, cannot contain letters or invalid characters, minimum 7 digits
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 7 || /[a-zA-Z]/.test(phone)) {
    if (typeof showToast === 'function') {
      showToast('Please enter a valid phone number (minimum 7 digits, numbers only).', 'error');
    }
    const phoneInput = document.getElementById('modalRegPhone');
    if (phoneInput) phoneInput.focus();
    return;
  }

  const newUser = {
    id: 'usr-' + Date.now().toString().slice(-4),
    name,
    email,
    password,
    phone,
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'Today'
  };

  const newPet = {
    id: 'pet-' + Date.now().toString().slice(-4),
    name: petName,
    species,
    breed: petBreed || (species === 'Cat' ? 'Domestic Shorthair' : 'Friendly Cross'),
    gender: 'Friendly',
    age: petAge || 'Adult',
    weight: petWeight || 'Medium',
    avatar: species === 'Cat'
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    ownerId: newUser.id,
    ownerName: name,
    ownerEmail: email,
    ownerPhone: phone,
    vaccinationStatus: 'Pending Verification',
    vaccinationExpiry: '2027-04-01',
    specialNotes: 'New registration via portal.',
    emergencyContact: `${name} (${phone})`
  };

  let users = JSON.parse(localStorage.getItem('paws_users') || '[]');
  users.push(newUser);
  localStorage.setItem('paws_users', JSON.stringify(users));

  let pets = JSON.parse(localStorage.getItem('paws_pets') || '[]');
  pets.push(newPet);
  localStorage.setItem('paws_pets', JSON.stringify(pets));

  setCurrentUser(newUser);
  closeAuthModal();
  if (typeof showToast === 'function') {
    showToast(`🎉 Welcome to PawsHaven, ${name}! Profile created for ${petName}.`, 'success', 4000);
  }

  setTimeout(() => {
    if (_authModalRedirect && _authModalRedirect.includes('.html') && !_authModalRedirect.includes('user.html') && !_authModalRedirect.toLowerCase().includes('dashboard')) {
      window.location.href = _authModalRedirect;
    } else {
      window.location.href = 'index.html';
    }
  }, 900);
}

// Global exposure
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.modalFillDemoId = modalFillDemoId;
window.handleModalLogin = handleModalLogin;
window.handleModalRegister = handleModalRegister;
window.handleModalForgotSubmit = handleModalForgotSubmit;
window.handleModalResetPassword = handleModalResetPassword;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleAuthOverlayClick = handleAuthOverlayClick;

// Profile Dropdown Functions
function toggleProfileDropdown(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const dropdown = document.getElementById('userProfileDropdown');
  const chevron = document.getElementById('userProfileChevron');
  const btn = document.getElementById('userProfileBtn');
  if (!dropdown) return;
  const isHidden = dropdown.classList.contains('hidden');
  if (isHidden) {
    dropdown.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  } else {
    dropdown.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

function closeProfileDropdown() {
  const dropdown = document.getElementById('userProfileDropdown');
  const chevron = document.getElementById('userProfileChevron');
  const btn = document.getElementById('userProfileBtn');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    dropdown.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

function handleAddAnotherAccount(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  closeProfileDropdown();
  window.location.href = 'login.html';
}

function handleSignOut(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  closeProfileDropdown();
  if (typeof logout === 'function') {
    logout();
  } else {
    sessionStorage.removeItem('paws_logged_in_this_session');
    sessionStorage.removeItem('paws_current_user');
    localStorage.removeItem('paws_current_user');
    if (typeof showToast === 'function') {
      showToast('Logged out successfully', 'info');
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  }
}

window.toggleProfileDropdown = toggleProfileDropdown;
window.closeProfileDropdown = closeProfileDropdown;
window.handleAddAnotherAccount = handleAddAnotherAccount;
window.handleSignOut = handleSignOut;

// Document click listener to close profile dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('userProfileWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    closeProfileDropdown();
  }
});

// Global Delegated Link Interceptor
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey) return;

  // If already on login.html or register.html, allow natural internal link handling
  const isAuthPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html');
  if (isAuthPage) return;

  // Let login.html and register.html navigate naturally to their dedicated full-page layouts
  if (href === 'login.html' || href.startsWith('login.html?') || href === 'register.html' || href.startsWith('register.html?')) {
    return;
  }
});

// ESC Key Listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (typeof window.closeMobileDrawer === 'function') {
      window.closeMobileDrawer();
    }
    closeAuthModal();
    closeProfileDropdown();
  }
});

// Auto-navigate to login.html or register.html if URL has auth query params
(function checkAuthUrlParams() {
  try {
    const isAuthPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html');
    if (isAuthPage) return;

    const urlParams = new URLSearchParams(window.location.search);
    const authMode = urlParams.get('auth');
    if (authMode === 'register') {
      window.location.href = 'register.html';
      return;
    }
    if (authMode === 'login') {
      const redirect = urlParams.get('redirect') || '';
      window.location.href = redirect ? `login.html?redirect=${encodeURIComponent(redirect)}` : 'login.html';
      return;
    }
    if (authMode === 'forgot') {
      window.location.href = 'login.html?tab=forgot';
      return;
    }
  } catch (e) {
    // Ignore in non-browser environments
  }
})();
