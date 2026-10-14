/**
 * PawsHaven - Unified Footer Component
 * Renders consistent footer, newsletter subscription, working hours, and accreditation badges.
 */

function renderPawsFooter() {
  const mount = document.getElementById("paws-footer");
  if (!mount || mount.dataset.rendered === "true") return;
  mount.dataset.rendered = "true";

  mount.innerHTML = `
    <footer class="bg-[var(--bg-surface)] border-t border-[var(--border-color)] pt-14 pb-12 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Main Footer Links Grid: 4 Balanced Columns with Unified Headers & Baselines -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10 mb-12 items-start">
          
          <!-- Column 1: Brand & Socials -->
          <div class="space-y-4">
            <div class="h-10 flex items-center">
              <a href="index.html" class="flex items-center gap-3 group">
                <div class="w-11 h-11 rounded-2xl bg-[#F0F1EC] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden border border-[var(--border-color)] flex-shrink-0">
                  <img src="images/logo.png" alt="PawsHaven Logo" class="w-full h-full object-cover block">
                </div>
                <div class="flex flex-col justify-center">
                  <span class="paws-brand-title block leading-none" style="font-family: 'Outfit', -apple-system, sans-serif !important; font-size: 1.45rem; font-weight: 800; letter-spacing: -0.03em;">
                    <span class="brand-paws text-[var(--brand-primary)] dark:text-emerald-400">Paws</span><span class="brand-haven text-[var(--brand-accent)]">Haven</span>
                  </span>
                  <span class="paws-brand-subtitle block mt-1" style="font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif !important; font-size: 0.625rem; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: var(--text-muted);">
                    Resort &amp; Daycare
                  </span>
                </div>
              </a>
            </div>
            <p class="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              A premium, loving second home for your four-legged family members. Supervised 24/7 luxury boarding, developmental daycare, medical care, and professional spa treatments.
            </p>

            <!-- Social Links -->
            <div class="flex items-center gap-2 pt-1">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center text-xs transition shadow-xs" title="Instagram" aria-label="Visit PawsHaven on Instagram">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center text-xs transition shadow-xs" title="Facebook" aria-label="Visit PawsHaven on Facebook">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center text-xs transition shadow-xs" title="TikTok" aria-label="Visit PawsHaven on TikTok">
                <i class="bi bi-tiktok"></i>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center text-xs transition shadow-xs" title="YouTube" aria-label="Visit PawsHaven on YouTube">
                <i class="bi bi-youtube"></i>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center text-xs transition shadow-xs" title="X / Twitter" aria-label="Visit PawsHaven on X">
                <i class="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          <!-- Column 2: Quick Links (ONLY: Home, About, Services, Packages, Contact) -->
          <div class="space-y-4">
            <div class="h-10 flex items-center">
              <h4 class="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[var(--brand-accent)] inline-block"></span>
                <span>Quick Links</span>
              </h4>
            </div>
            <ul class="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <a href="index.html" class="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition inline-flex items-center gap-2">
                  <i class="bi bi-chevron-right text-[10px] text-[var(--brand-accent)]"></i>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="about.html" class="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition inline-flex items-center gap-2">
                  <i class="bi bi-chevron-right text-[10px] text-[var(--brand-accent)]"></i>
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="services.html" class="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition inline-flex items-center gap-2">
                  <i class="bi bi-chevron-right text-[10px] text-[var(--brand-accent)]"></i>
                  <span>Services</span>
                </a>
              </li>
              <li>
                <a href="pricing.html" class="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition inline-flex items-center gap-2">
                  <i class="bi bi-chevron-right text-[10px] text-[var(--brand-accent)]"></i>
                  <span>Packages</span>
                </a>
              </li>
              <li>
                <a href="contact.html" class="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition inline-flex items-center gap-2">
                  <i class="bi bi-chevron-right text-[10px] text-[var(--brand-accent)]"></i>
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <a href="login.html" class="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition inline-flex items-center gap-2">
                  <i class="bi bi-chevron-right text-[10px] text-[var(--brand-accent)]"></i>
                  <span>Parent Portal (Sign In)</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Contact Info (Mobile Number, Mail & Location - Placed after Quick Links) -->
          <div class="space-y-4">
            <div class="h-10 flex items-center">
              <h4 class="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[var(--brand-primary)] inline-block"></span>
                <span>Contact Info</span>
              </h4>
            </div>
            <div class="space-y-3 text-xs sm:text-sm text-[var(--text-main)]">
              <!-- Mobile / Phone -->
              <div class="flex items-start gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] text-[var(--brand-primary)] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  <i class="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <a href="tel:5557297428" class="text-[var(--text-main)] hover:text-[var(--brand-primary)] font-semibold transition block leading-tight">(555) 729-7428</a>
                  <span class="text-[11px] text-[var(--text-muted)]">(555) PAW-STAY</span>
                </div>
              </div>

              <!-- Mail -->
              <div class="flex items-start gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] text-[var(--brand-primary)] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  <i class="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <a href="mailto:concierge@pawshavenresort.com" class="text-[var(--text-main)] hover:text-[var(--brand-primary)] transition break-all block leading-tight">concierge@pawshavenresort.com</a>
                  <span class="text-[11px] text-[var(--text-muted)]">Inquiries & Support</span>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-start gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] text-[var(--brand-accent)] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  <i class="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <span class="text-[var(--text-main)] block leading-snug">4820 Paws Meadow Blvd,</span>
                  <span class="text-[var(--text-muted)] text-[11px]">Austin, TX 78704</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 4: Right End Container (VIP Pet Parent Community) -->
          <div class="space-y-4">
            <div class="h-10 flex items-center">
              <h4 class="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[var(--brand-accent)] inline-block"></span>
                <span>VIP Community</span>
              </h4>
            </div>
            <div class="bg-gradient-to-br from-[#FAF5EE] via-[var(--bg-surface)] to-[#F4EFEA] dark:from-[#1E2B24] dark:via-[#18231D] dark:to-[#141C18] text-[var(--text-main)] rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between border border-[var(--border-color)] dark:border-[#2D3E35]">
              <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-[var(--brand-accent)]/10 dark:bg-[var(--brand-accent)]/10 rounded-full blur-xl pointer-events-none"></div>
              <div class="absolute -top-8 -left-8 w-24 h-24 bg-[var(--brand-primary)]/5 dark:bg-emerald-500/10 rounded-full blur-lg pointer-events-none"></div>
              <div class="relative z-10 space-y-3">
                <div class="flex items-center justify-between gap-1">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-[10px] font-bold uppercase tracking-wider border border-[var(--brand-primary)]/20">
                    <i class="bi bi-shield-heart-fill text-[var(--brand-primary)]"></i> Safe Stay Promise
                  </span>
                  <span class="inline-flex items-center gap-1 text-[11px] font-black text-[var(--brand-accent)] bg-[var(--brand-accent)]/10 px-2 py-0.5 rounded-md border border-[var(--brand-accent)]/20">
                    $25 Welcome Gift
                  </span>
                </div>
                <h4 class="text-sm sm:text-base font-extrabold text-[var(--text-main)] leading-snug">
                  Join our VIP Community
                </h4>
                <p class="text-[var(--text-muted)] text-xs leading-relaxed">
                  Weekly vet wellness advice, holiday priority, and special member perks.
                </p>
                <form id="footerNewsletterForm" class="flex flex-col gap-2">
                  <input type="email" id="footerEmailInput" required placeholder="Enter your email address..." class="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] dark:bg-[#121A16] border border-[var(--border-color)] dark:border-[#2D3E35] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/70 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] focus:border-transparent transition shadow-xs">
                  <button type="submit" class="btn-brand-accent py-2.5 px-4 text-xs font-bold rounded-xl whitespace-nowrap flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition">
                    <span>Subscribe Free</span>
                    <i class="bi bi-arrow-right text-[11px]"></i>
                  </button>
                </form>
                <p class="text-[var(--text-muted)] text-[10px] flex items-center gap-1.5 pt-0.5">
                  <i class="bi bi-shield-check text-[var(--brand-primary)] text-xs"></i> We cherish your privacy. Zero spam.
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Accreditations & Trust Seals (Brand Colors) -->
        <div class="py-6 border-y border-[var(--border-color)] flex flex-wrap items-center justify-center md:justify-between gap-6 text-xs text-[var(--text-muted)]">
          <div class="flex items-center gap-2">
            <i class="bi bi-patch-check-fill text-[var(--brand-primary)] text-lg"></i>
            <span class="font-semibold">Fear Free Certified Facility</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="bi bi-award-fill text-[var(--brand-accent)] text-lg"></i>
            <span class="font-semibold">PACCC Professional Accredited</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="bi bi-heart-pulse-fill text-[var(--brand-accent)] text-lg"></i>
            <span class="font-semibold">100% Pet First-Aid & CPR Certified</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="bi bi-shield-fill-check text-[var(--brand-primary)] text-lg"></i>
            <span class="font-semibold">Veterinary Partner Network</span>
          </div>
        </div>

        <!-- Bottom Copyright Row -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] text-center sm:text-left">
          <p class="leading-relaxed">© 2026 PawsHaven Resort & Daycare, LLC. All rights reserved. Crafted with care for pet lovers worldwide.</p>
          <div class="flex items-center justify-center sm:justify-end gap-6 flex-wrap">
            <a href="javascript:void(0)" onclick="showToast('Privacy Policy: Pet health records and video streams are strictly confidential.', 'info')" class="hover:text-[var(--brand-primary)] transition">Privacy Policy</a>
            <a href="javascript:void(0)" onclick="showToast('Terms of Service: Full vaccination verification required prior to check-in.', 'info')" class="hover:text-[var(--brand-primary)] transition">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  `;

  // Working newsletter form handler
  const newsletterForm = document.getElementById("footerNewsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("footerEmailInput").value.trim();
      if (email) {
        let subs = JSON.parse(localStorage.getItem("paws_newsletter_subscribers") || "[]");
        if (!subs.includes(email)) {
          subs.push(email);
          localStorage.setItem("paws_newsletter_subscribers", JSON.stringify(subs));
        }
        showToast(`Thank you! Welcome to the PawsHaven family (${email}). Check your inbox for your $25 welcome gift coupon!`, "success", 4500);
        newsletterForm.reset();
      }
    });
  }
}

// Immediate rendering for zero flicker, with DOMContentLoaded fallback
if (document.getElementById('paws-footer')) {
  renderPawsFooter();
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPawsFooter);
} else {
  renderPawsFooter();
}
