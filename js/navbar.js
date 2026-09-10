/**
 * PawsHaven - Unified Navbar Component
 * Renders consistent header, dropdowns, mobile drawer, theme/RTL toggles, and auth state.
 */

const PAW_LOGO_SVG = (sizeClass = "w-6 h-6") => `
  <svg class="${sizeClass} fill-current text-white flex-shrink-0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-label="PawsHaven Logo">
    <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c7.3 19.4-.5 40.7-17.4 50.1l-14.7 8.2c-15.1 8.5-34.1 3.5-42.6-11.6l-50.5-88.8-50.5 88.8c-8.5 15.1-27.5 20.1-42.6 11.6l-14.7-8.2c-16.9-9.4-24.7-30.7-17.4-50.1zM344.2 198.6c-18.9 32.4-14.3 70.1 10.2 84.1s59.7-.9 78.5-33.3 14.3-70.1-10.2-84.1-59.7.9-78.5 33.3zM448.2 92.9c-14.3 42.9.3 86.2 32.6 96.8s70.1-15.6 84.4-58.5-.3-86.2-32.6-96.8-70.1 15.6-84.4 58.5z"/>
  </svg>
`;

function renderPawsNavbar() {
  const mount = document.getElementById("paws-navbar");
  if (!mount || mount.dataset.rendered === "true") return;
  mount.dataset.rendered = "true";

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
      ? "px-2.5 xl:px-3.5 py-2 text-xs xl:text-sm font-bold text-[var(--brand-primary)] bg-[var(--bg-subtle)] rounded-xl transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
      : "px-2.5 xl:px-3.5 py-2 text-xs xl:text-sm font-semibold text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-subtle)] rounded-xl transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0";
  };

  let authButtonsHtml = '';
  if (currentUser) {
    authButtonsHtml = `
      <div class="relative group flex-shrink-0">
        <button id="userProfileBtn" onclick="window.location.href='user.html'" title="Owner: ${currentUser.name}" class="h-10 flex items-center gap-2.5 px-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] transition border border-[var(--border-color)] cursor-pointer whitespace-nowrap flex-shrink-0">
          <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}" alt="${currentUser.name}" class="w-7 h-7 rounded-lg object-cover border border-white shadow-xs">
          <span class="text-xs font-bold text-[var(--text-main)] hidden md:inline-block">${currentUser.name}</span>
          <i class="bi bi-chevron-down text-[10px] opacity-60"></i>
        </button>
        <!-- Profile Hover Card -->
        <div class="absolute right-0 top-full pt-2 w-52 hidden group-hover:block z-50 text-center animate-float-none">
          <div class="bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-color)] p-3.5">
            <div class="w-11 h-11 rounded-full mx-auto mb-2 overflow-hidden border-2 border-[var(--brand-primary)] shadow-sm">
              <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}" alt="${currentUser.name}" class="w-full h-full object-cover">
            </div>
            <span class="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-1">Pet Owner</span>
            <p class="text-sm font-black text-[var(--text-main)] truncate" title="${currentUser.name}">${currentUser.name}</p>
            <p class="text-[11px] text-[var(--text-muted)] truncate mb-3">${currentUser.email || ''}</p>
            <button onclick="event.stopPropagation(); logout()" class="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition border border-rose-200 dark:border-rose-900/40 cursor-pointer">
              <i class="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    `;
  } else {
    authButtonsHtml = `
      <button type="button" onclick="openAuthModal('login')" class="h-10 text-xs font-bold text-[var(--text-main)] hover:text-[var(--brand-primary)] px-3 rounded-xl hover:bg-[var(--bg-subtle)] transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0">
        <i class="bi bi-box-arrow-in-right text-sm"></i>
        <span>Log In</span>
      </button>
      <button type="button" onclick="openAuthModal('register')" class="hidden xl:inline-flex h-10 btn-brand-outline text-xs font-bold px-3.5 rounded-xl items-center gap-1.5 shadow-xs transition hover:border-[var(--brand-primary)] cursor-pointer whitespace-nowrap flex-shrink-0">
        <i class="bi bi-person-plus-fill text-[var(--brand-accent)] text-sm"></i>
        <span>Register</span>
      </button>
      <button type="button" onclick="openAuthModal('login', 'booking.html')" class="h-10 btn-brand-accent text-xs font-bold px-3.5 xl:px-4 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-md transition cursor-pointer whitespace-nowrap flex-shrink-0">
        <i class="bi bi-calendar-heart text-sm"></i>
        <span>Book a Stay</span>
      </button>
    `;
  }

  mount.innerHTML = `
    <header class="fixed top-0 left-0 w-full z-50 paws-navbar-header bg-[var(--bg-surface)] border-b border-[var(--border-color)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300" style="background-color: var(--bg-surface);">
      <div class="paws-navbar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 h-20 flex items-center justify-between gap-4">
        
        <!-- Left Column: Brand Logo -->
        <div class="flex items-center flex-shrink-0">
          <a href="index.html" class="paws-brand-link flex items-center gap-3 group">
            <div class="w-11 h-11 rounded-2xl bg-[#F0F1EC] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden border border-[var(--border-color)] flex-shrink-0">
              <img src="images/logo.png" alt="PawsHaven Resort Logo" class="w-full h-full object-cover block">
            </div>
            <div class="flex flex-col justify-center">
              <span class="text-xl font-black tracking-tight text-[var(--brand-primary)] dark:text-emerald-400 leading-tight whitespace-nowrap">
                Paws<span class="text-[var(--brand-accent)]">Haven</span>
              </span>
              <span class="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] -mt-0.5 whitespace-nowrap">
                Resort & Daycare
              </span>
            </div>
          </a>
        </div>

        <!-- Center Column: Desktop Navigation Links (Centered) -->
        <nav class="paws-desktop-nav hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 mx-2 xl:mx-4">
          <!-- Home Dropdown -->
          <div class="paws-dropdown-wrapper relative group flex-shrink-0">
            <button class="${navClass('home')} cursor-pointer">
              <span>Home</span>
              <i class="bi bi-chevron-down text-[10px] opacity-60 group-hover:rotate-180 transition-transform duration-200"></i>
            </button>
            <div class="paws-dropdown-menu absolute left-0 top-full pt-1.5 w-56 hidden group-hover:block z-50">
              <div class="bg-[var(--bg-surface)] rounded-2xl shadow-xl border border-[var(--border-color)] py-2 animate-fadeIn">
                <a href="index.html" class="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--bg-subtle)] transition">
                  <i class="bi bi-house-heart text-[var(--brand-accent)] text-base mt-0.5"></i>
                  <div>
                    <div class="text-xs font-bold text-[var(--text-main)]">Home 1 - Resort</div>
                    <div class="text-[11px] text-[var(--text-muted)]">Luxury Boarding & Daycare</div>
                  </div>
                </a>
                <a href="home2.html" class="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--bg-subtle)] transition">
                  <i class="bi bi-cpu text-[var(--brand-primary)] text-base mt-0.5"></i>
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
        </nav>

        <!-- Right Column: Utility Controls, Auth & CTAs -->
        <div class="paws-nav-right flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <!-- Utility Controls: Theme & RTL Toggles in sleek pill container -->
          <div class="paws-util-pill flex items-center p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] gap-1 flex-shrink-0">
            <button onclick="toggleTheme()" class="btn-theme-toggle w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition cursor-pointer" title="Toggle Light/Dark Theme">
              <i class="theme-toggle-icon bi bi-moon-stars-fill text-xs text-amber-500"></i>
            </button>
            <button onclick="toggleRTL()" class="btn-rtl-toggle w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition text-xs font-bold cursor-pointer" title="Toggle RTL / LTR Direction">
              ⇄
            </button>
          </div>

          <!-- Divider -->
          <div class="paws-nav-divider hidden sm:block h-6 w-px bg-[var(--border-color)] mx-0.5 xl:mx-1 flex-shrink-0"></div>

          <!-- Auth & CTA Buttons -->
          <div class="paws-auth-cluster hidden sm:flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            ${authButtonsHtml}
          </div>

          <!-- Mobile Hamburger -->
          <button id="mobileMenuBtn" class="paws-mobile-menu-btn lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-xl text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition border border-[var(--border-color)] cursor-pointer flex-shrink-0" aria-label="Open navigation menu">
            <i class="bi bi-list"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Drawer & Backdrop -->
    <div id="mobileDrawerOverlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] hidden opacity-0 transition-opacity duration-300"></div>

    <aside id="mobileDrawer" class="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-[var(--bg-surface)] text-[var(--text-main)] z-[100] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col border-s border-[var(--border-color)]">
      
      <!-- Drawer Header -->
      <div class="p-5 flex items-center justify-between border-b border-[var(--border-color)]">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-[#F0F1EC] flex items-center justify-center shadow-xs overflow-hidden border border-[var(--border-color)] flex-shrink-0">
            <img src="images/logo.png" alt="PawsHaven Logo" class="w-full h-full object-cover block">
          </div>
          <span class="font-bold text-base text-[var(--brand-primary)]">Paws<span class="text-[var(--brand-accent)]">Haven</span></span>
        </div>
        <button id="closeDrawerBtn" class="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-[var(--bg-subtle)] transition">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Drawer Content -->
      <div class="flex-1 overflow-y-auto p-5 space-y-4">
        
        <div class="space-y-1">
          <div class="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Navigation</div>
          <a href="index.html" class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--bg-subtle)] text-sm font-semibold transition">
            <span>Home</span>
            <i class="bi bi-chevron-right text-xs opacity-50"></i>
          </a>
          <a href="about.html" class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--bg-subtle)] text-sm font-semibold transition">
            <span>About Us</span>
            <i class="bi bi-chevron-right text-xs opacity-50"></i>
          </a>
          <a href="services.html" class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--bg-subtle)] text-sm font-semibold transition">
            <span>Our Services</span>
            <i class="bi bi-chevron-right text-xs opacity-50"></i>
          </a>
          <a href="facilities.html" class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--bg-subtle)] text-sm font-semibold transition">
            <span>Facilities & Suites Tour</span>
            <i class="bi bi-chevron-right text-xs opacity-50"></i>
          </a>
          <a href="pricing.html" class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--bg-subtle)] text-sm font-semibold transition">
            <span>Rates & Packages</span>
            <i class="bi bi-chevron-right text-xs opacity-50"></i>
          </a>
          <a href="blog.html" class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--bg-subtle)] text-sm font-semibold transition">
            <span>Pet Care Articles</span>
            <i class="bi bi-chevron-right text-xs opacity-50"></i>
          </a>
          <a href="contact.html" class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--bg-subtle)] text-sm font-semibold transition">
            <span>Contact & Location</span>
            <i class="bi bi-chevron-right text-xs opacity-50"></i>
          </a>
        </div>

      </div>

      <!-- Drawer Footer Actions -->
      <div class="p-5 border-t border-[var(--border-color)] bg-[var(--bg-subtle)] space-y-3">
        <!-- Mobile Theme & RTL Quick Toggles -->
        <div class="flex items-center justify-between gap-2 text-xs">
          <button onclick="toggleTheme()" class="btn-theme-toggle flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold shadow-sm hover:border-[var(--brand-primary)]">
            <i class="theme-toggle-icon bi bi-moon-stars-fill text-amber-500"></i>
            <span>Theme Mode</span>
          </button>
          <button onclick="toggleRTL()" class="btn-rtl-toggle flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold shadow-sm hover:border-[var(--brand-primary)]">
            <span>⇄ RTL / LTR</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          ${currentUser ? `
            <button onclick="logout()" class="flex-1 py-2 rounded-xl border border-rose-300 text-rose-600 text-xs font-bold text-center">
              Log Out
            </button>
          ` : `
            <button type="button" onclick="closeDrawer(); openAuthModal('login');" class="flex-1 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-bold text-center">
              Log In
            </button>
            <button type="button" onclick="closeDrawer(); openAuthModal('register');" class="flex-1 py-2 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold text-center">
              Sign Up
            </button>
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
        <div class="text-center mb-6">
          <div id="authModalIcon" class="w-16 h-16 rounded-2xl bg-[#F0F1EC] flex items-center justify-center shadow-md mx-auto mb-3 overflow-hidden border border-[var(--border-color)] transition-colors">
            <img src="images/logo.png" alt="PawsHaven Logo" class="w-full h-full object-cover block">
          </div>
          <h3 id="authModalTitle" class="text-2xl font-black text-[var(--text-main)] leading-tight">Welcome to PawsHaven</h3>
          <p id="authModalSubtitle" class="text-xs text-[var(--text-muted)] mt-1">Access your pet parent portal & reservations</p>
        </div>

        <!-- Segmented Mode Tabs (Sign In / Register) -->
        <div class="grid grid-cols-2 p-1 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] mb-6 text-xs font-bold">
          <button type="button" id="authTabLogin" onclick="switchAuthTab('login')" class="py-2.5 rounded-xl transition shadow-sm bg-[var(--bg-surface)] text-[var(--text-main)]">
            <i class="bi bi-box-arrow-in-right me-1"></i> Sign In
          </button>
          <button type="button" id="authTabRegister" onclick="switchAuthTab('register')" class="py-2.5 rounded-xl transition text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <i class="bi bi-person-plus-fill me-1"></i> Register
          </button>
        </div>

        <!-- View 1: Login -->
        <div id="authModalLoginView">
          <!-- Login Form -->
          <form id="modalLoginForm" onsubmit="event.preventDefault(); handleModalLogin();" class="space-y-4 text-xs">
            <div>
              <label for="modalLoginId" class="block font-bold text-[var(--text-muted)] mb-1">Email or Username <span class="text-rose-500">*</span></label>
              <div class="relative">
                <i class="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                <input type="text" id="modalLoginId" required placeholder="user@gmail.com" class="w-full ps-10 pe-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
            </div>

            <div>
              <label for="modalLoginPassword" class="block font-bold text-[var(--text-muted)] mb-1">Password <span class="text-rose-500">*</span></label>
              <div class="relative">
                <i class="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm"></i>
                <input type="password" id="modalLoginPassword" required placeholder="••••••••" class="w-full ps-10 pe-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
            </div>

            <button type="submit" id="modalLoginBtn" class="btn-brand-primary w-full py-3.5 rounded-xl font-bold text-xs shadow-md mt-2 flex items-center justify-center gap-2">
              <span>Log In as Pet Owner</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </form>
        </div>

        <!-- View 2: Register -->
        <div id="authModalRegisterView" class="hidden">
          <form id="modalRegisterForm" onsubmit="event.preventDefault(); handleModalRegister();" class="space-y-3.5 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label for="modalRegName" class="block font-bold text-[var(--text-muted)] mb-1">Your Full Name <span class="text-rose-500">*</span></label>
                <input type="text" id="modalRegName" required placeholder="Rachel Adams" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
              <div>
                <label for="modalRegPhone" class="block font-bold text-[var(--text-muted)] mb-1">Phone Number <span class="text-rose-500">*</span></label>
                <input type="tel" id="modalRegPhone" required placeholder="+1 (555) 000-0000" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label for="modalRegEmail" class="block font-bold text-[var(--text-muted)] mb-1">Email Address <span class="text-rose-500">*</span></label>
                <input type="email" id="modalRegEmail" required placeholder="rachel@example.com" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
              <div>
                <label for="modalRegPassword" class="block font-bold text-[var(--text-muted)] mb-1">Password <span class="text-rose-500">*</span></label>
                <input type="password" id="modalRegPassword" required placeholder="••••••••" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[var(--border-color)]">
              <div>
                <label for="modalRegPetName" class="block font-bold text-[var(--text-muted)] mb-1">Pet's Name <span class="text-rose-500">*</span></label>
                <input type="text" id="modalRegPetName" required placeholder="Toby" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
              <div>
                <label for="modalRegPetSpecies" class="block font-bold text-[var(--text-muted)] mb-1">Species</label>
                <select id="modalRegPetSpecies" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
            </div>

            <!-- Pet Breed, Pet Age & Pet Weight Split into Separate Inputs -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label for="modalRegPetBreed" class="block font-bold text-[var(--text-muted)] mb-1">Pet Breed</label>
                <input type="text" id="modalRegPetBreed" placeholder="e.g. Golden Retriever" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
              <div>
                <label for="modalRegPetAge" class="block font-bold text-[var(--text-muted)] mb-1">Pet Age</label>
                <input type="text" id="modalRegPetAge" placeholder="e.g. 2 years" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
              <div>
                <label for="modalRegPetWeight" class="block font-bold text-[var(--text-muted)] mb-1">Pet Weight</label>
                <input type="text" id="modalRegPetWeight" placeholder="e.g. 28 lbs" class="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none">
              </div>
            </div>

            <button type="submit" id="modalRegBtn" class="btn-brand-accent w-full py-3.5 rounded-xl font-bold text-xs shadow-md mt-3 flex items-center justify-center gap-2">
              <i class="bi bi-check-circle-fill"></i>
              <span>Create Account & Pet Profile</span>
            </button>
          </form>

          <div class="text-center pt-4 mt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
            Already have an account? <button type="button" onclick="switchAuthTab('login')" class="font-bold text-[var(--brand-primary)] hover:underline">Log In to Portal</button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Drawer open / close handlers
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("mobileDrawerOverlay");

  function openDrawer() {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.remove("opacity-0");
      drawer.classList.remove("translate-x-full");
    }, 10);
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    overlay.classList.add("opacity-0");
    drawer.classList.add("translate-x-full");
    setTimeout(() => {
      overlay.classList.add("hidden");
      document.body.style.overflow = "";
    }, 300);
  }

  window.closeMobileDrawer = closeDrawer;

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

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
  _authModalRedirect = redirectTarget || '';
  let overlay = document.getElementById('pawsAuthModalOverlay');
  if (!overlay) return;

  // Ensure modal overlay is attached directly to document.body
  if (overlay.parentElement !== document.body) {
    document.body.appendChild(overlay);
  }

  switchAuthTab(mode);
  overlay.classList.add('active');
  document.body.classList.add('auth-modal-open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    if (mode === 'register') {
      const el = document.getElementById('modalRegName');
      if (el) el.focus();
    } else {
      const el = document.getElementById('modalLoginId');
      if (el) el.focus();
    }
  }, 100);
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

function switchAuthTab(mode) {
  const tabLogin = document.getElementById('authTabLogin');
  const tabRegister = document.getElementById('authTabRegister');
  const viewLogin = document.getElementById('authModalLoginView');
  const viewRegister = document.getElementById('authModalRegisterView');
  const modalIcon = document.getElementById('authModalIcon');
  const modalTitle = document.getElementById('authModalTitle');
  const modalSubtitle = document.getElementById('authModalSubtitle');

  if (mode === 'register') {
    if (tabLogin) {
      tabLogin.className = 'py-2.5 rounded-xl transition text-[var(--text-muted)] hover:text-[var(--text-main)]';
    }
    if (tabRegister) {
      tabRegister.className = 'py-2.5 rounded-xl transition shadow-sm bg-[var(--bg-surface)] text-[var(--text-main)]';
    }
    if (viewLogin) viewLogin.classList.add('hidden');
    if (viewRegister) viewRegister.classList.remove('hidden');
    if (modalIcon) {
      modalIcon.className = 'w-12 h-12 rounded-2xl bg-[var(--brand-accent)] text-white flex items-center justify-center text-xl shadow-md mx-auto mb-3 transition-colors';
      modalIcon.innerHTML = '<i class="bi bi-heart-fill"></i>';
    }
    if (modalTitle) modalTitle.innerText = 'Join the PawsHaven Family';
    if (modalSubtitle) modalSubtitle.innerText = 'Create your pet parent profile in under 2 minutes';
  } else {
    if (tabLogin) {
      tabLogin.className = 'py-2.5 rounded-xl transition shadow-sm bg-[var(--bg-surface)] text-[var(--text-main)]';
    }
    if (tabRegister) {
      tabRegister.className = 'py-2.5 rounded-xl transition text-[var(--text-muted)] hover:text-[var(--text-main)]';
    }
    if (viewLogin) viewLogin.classList.remove('hidden');
    if (viewRegister) viewRegister.classList.add('hidden');
    if (modalIcon) {
      modalIcon.className = 'w-16 h-16 rounded-2xl bg-[#F0F1EC] flex items-center justify-center shadow-md mx-auto mb-3 overflow-hidden border border-[var(--border-color)] transition-colors';
      modalIcon.innerHTML = '<img src="images/logo.png" alt="PawsHaven Logo" class="w-full h-full object-cover block">';
    }
    if (modalTitle) modalTitle.innerText = 'Welcome to PawsHaven';
    if (modalSubtitle) modalSubtitle.innerText = 'Access your pet parent portal & reservations';
  }
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
      if (_authModalRedirect && (_authModalRedirect.includes('.html') || _authModalRedirect.includes('booking'))) {
        window.location.href = _authModalRedirect;
      } else if (window.location.pathname.includes('booking.html')) {
        window.location.reload();
      } else {
        window.location.href = 'user.html';
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
    if (_authModalRedirect && _authModalRedirect.includes('.html')) {
      window.location.href = _authModalRedirect;
    } else {
      window.location.href = 'user.html';
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
window.handleAuthOverlayClick = handleAuthOverlayClick;

// Global Delegated Link Interceptor
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey) return;

  if (href === 'login.html' || href.startsWith('login.html?')) {
    e.preventDefault();
    let redirect = '';
    if (href.includes('redirect=')) {
      redirect = href.split('redirect=')[1].split('&')[0];
    }
    openAuthModal('login', redirect);
  } else if (href === 'register.html' || href.startsWith('register.html?')) {
    e.preventDefault();
    openAuthModal('register');
  }
});

// ESC Key Listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAuthModal();
  }
});

// Auto-open modal if URL has ?auth=login or ?auth=register
(function checkAuthUrlParams() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const authMode = urlParams.get('auth');
    if (authMode === 'login' || authMode === 'register') {
      const redirect = urlParams.get('redirect') || '';
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => openAuthModal(authMode, redirect), 180);
        });
      } else {
        setTimeout(() => openAuthModal(authMode, redirect), 180);
      }
    }
  } catch (e) {
    // Ignore in non-browser environments
  }
})();
