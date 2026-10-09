# PawsHaven - Luxury Pet Boarding & Daycare Kennel HTML Template

A modern, production-grade, ThemeForest-ready HTML5/Tailwind CSS template designed for premium pet boarding facilities, canine daycare resorts, catteries, grooming spas, and multi-location animal hospitality businesses.

---

## Key Highlights

- **16 Complete Production-Ready HTML Pages** (No placeholders, no dead buttons).
- **Dedicated Pet Owner Portal (`user.html`)**:
  - Pet CRUD management, real-time 5-stage stay tracking, daily activity & feeding logs, health vitals & reminders, photo gallery with lightbox, and itemized invoice download/print engine.
- **Interactive Multi-Step Booking Wizard (`booking.html`)**: 5-step wizard with live price calculation, suite tier selection, add-ons picker, long-stay 15% discount logic, and instant LocalStorage confirmation with unique Booking ID generation.
- **Real-Time 5-Stage Stay Tracker (`stay-tracking.html`)**: Live animated progress bar (`Checked In` → `Settling In` → `Daily Activities` → `Health Check` → `Ready for Pickup`) with interactive simulator buttons.
- **Theme & Accessibility**:
  - Light & Cozy Dark Mode toggle with LocalStorage persistence.
  - Full RTL (Right-to-Left) Arabic/Hebrew layout flip via CSS logical properties.
  - 100% responsive across 320px, 375px, 768px, 1024px, 1440px, and 4K displays.
- **No Backend Frameworks Required**: Pure frontend HTML5, Tailwind CSS, Vanilla ES6 JavaScript, and browser `localStorage` preloaded with realistic seed data.

---

## Pet Parent Login Credentials

Enter the following credentials in the navbar Sign In modal:

| Role | Username / Email | Password | Destination |
| :--- | :--- | :--- | :--- |
| **Pet Parent (User)** | `user@gmail.com` | `1234` | `user.html` (Owner Portal) |

---

## Included Pages & Directory Map

```
pawshaven/
├── index.html            # Home 1 - Luxury Resort & Daycare Landing Page
├── home2.html            # Home 2 - Modern Pet Care Platform / SaaS Hybrid
├── about.html            # About Us, Founder Story, 10-Yr Timeline, Safety Protocols
├── services.html         # All 12 Pet Care Services with Live Category Filter Tabs
├── service-details.html  # Service Deep Dive (Overnight Boarding, Dynamic Calculator, FAQ)
├── facilities.html       # 5-Acre Suites Tour, 4K Gallery with Lightbox Viewer, Video Modal
├── pricing.html          # 4 Stay Tiers (Basic, Standard, Premium, Penthouse) + Matrix Table
├── booking.html          # 5-Step Interactive Booking Engine with LocalStorage confirmation
├── stay-tracking.html    # Real-Time 5-Stage Animated Tracker with Interactive Simulator
├── reminders.html        # Health, Vaccine, Flea/Tick Reminders with Modal Record Logger
├── blog.html             # Journal Listing with Live Search and Category Filter
├── blog-details.html     # Single Article with Interactive Table of Contents & Comments
├── contact.html          # Contact info, Live "Open Now" badge, Validated Form, Directions
├── login.html            # Dedicated Authentication Page (Sign In, Register, Forgot Password)
├── register.html         # Pet Owner Registration with Pet Onboarding Fields
├── 404.html              # Playful Pet-Themed 404 Error Page
├── coming-soon.html      # Maintenance / New Expansion Page with Live Countdown Timer
├── user.html             # Dedicated Pet Owner Portal (Overview, Pet CRUD, Logs, Photos, Invoices)
├── css/
│   └── style.css         # Theme tokens, Dark Mode, RTL logical properties, Print CSS
└── js/
    ├── data.js           # LocalStorage database initializer & seed records
    ├── app.js            # Toast system, modal manager, theme/RTL toggles, auth helpers
    ├── navbar.js         # Unified modular sticky header, dropdowns, and mobile drawer
    ├── footer.js         # Unified modular footer with newsletter, hours, trust badges
    ├── booking.js        # Multi-step booking wizard engine & price calculation
    └── user-dashboard.js # Pet owner portal controller (Pet CRUD, Logs, Invoices)
```

---

## Quick Start / How to Run

1. Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari, Brave).
2. Alternatively, open the `pawshaven` folder in VS Code and click **"Open with Live Server"**.
3. All data (pets, bookings, staff notes, logs, comments, newsletters) will automatically initialize in your browser's `localStorage` on first load.

---

## Customization

- **Colors**: Easily customize brand colors in `css/style.css` under the `:root` variables:
  - `--brand-primary`: Main theme color (Default: `#1B4D3E` Forest Teal)
  - `--brand-accent`: Accent & CTA color (Default: `#E07A5F` Terracotta / Coral)
  - `--bg-base`: Base background (Default: `#FAF8F5` Warm Cream / Soft Ivory)
- **Imagery**: All photography is linked to curated, high-resolution 4K Unsplash pet and resort images. Replace image URLs with your local assets as needed.

---

© 2026 PawsHaven Resort & Daycare. All rights reserved. Crafted with care for pet care businesses worldwide.
