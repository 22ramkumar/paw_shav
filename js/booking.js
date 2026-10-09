/**
 * PawsHaven - Interactive Multi-Step Booking Wizard Controller
 */

let bookingState = {
  step: 1,
  petType: "existing",
  petId: "",
  petName: "Max",
  petBreed: "Golden Retriever",
  petSpecies: "Dog",
  petWeight: "68 lbs",
  serviceId: "srv-1",
  serviceName: "Overnight Luxury Boarding",
  baseRate: 59,
  suiteTier: "Deluxe Glass Suite",
  suiteExtra: 20,
  checkInDate: "",
  checkInTime: "08:00 AM",
  checkOutDate: "",
  checkOutTime: "06:00 PM",
  days: 3,
  addOns: [],
  feedingNotes: "Salmon kibble 2x daily. No chicken.",
  medicationNotes: "None",
  emergencyContact: "Dr. Marcus Vance (555-900-4321)",
  ownerId: "usr-01",
  ownerName: "Sarah Jenkins",
  ownerEmail: "sarah@example.com",
  ownerPhone: "+1(555)234-5678"
};

document.addEventListener("DOMContentLoaded", () => {
  // Enforce Auth: User must be authenticated to book a stay
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.replace("index.html?auth=login&redirect=booking.html");
    return;
  }

  // Populate booking state with authenticated user profile
  bookingState.ownerId = currentUser.id || "usr-01";
  bookingState.ownerName = currentUser.name || "Pet Parent";
  bookingState.ownerEmail = currentUser.email || "";
  bookingState.ownerPhone = (currentUser.phone || "+1(555)234-5678").replace(/\s+/g, '');

  // Update Auth Banner in Wizard
  const greetingEl = document.getElementById("authUserGreeting");
  const badgeEl = document.getElementById("authRoleBadge");
  const emailEl = document.getElementById("authUserEmail");
  if (greetingEl) greetingEl.textContent = `Logged in as ${currentUser.name}`;
  if (badgeEl) badgeEl.textContent = "Pet Parent";
  if (emailEl) emailEl.textContent = `${currentUser.email} • ID: ${currentUser.id || 'usr-01'}`;

  // Read preset dates from sessionStorage if initiated from quick booking bar
  const presetCheckIn = sessionStorage.getItem("paws_booking_checkin");
  const presetCheckOut = sessionStorage.getItem("paws_booking_checkout");

  const now = new Date();
  const formatLocal = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatLocal(now);
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const nextDayStr = formatLocal(nextDay);

  bookingState.checkInDate = presetCheckIn || todayStr;
  bookingState.checkOutDate = presetCheckOut || nextDayStr;

  // Clean up preset dates
  if (presetCheckIn) sessionStorage.removeItem("paws_booking_checkin");
  if (presetCheckOut) sessionStorage.removeItem("paws_booking_checkout");

  // Check preset service from sessionStorage
  const presetService = sessionStorage.getItem("paws_booking_preset");
  if (presetService) {
    const services = JSON.parse(localStorage.getItem("paws_services") || "[]");
    const matched = services.find(s => s.slug === presetService || s.id === presetService);
    if (matched) {
      bookingState.serviceId = matched.id;
      bookingState.serviceName = matched.title;
      bookingState.baseRate = matched.price;
    }
    sessionStorage.removeItem("paws_booking_preset");
  }

  initBookingUI();
});

function initBookingUI() {
  renderPetSelection();
  renderServiceSelection();
  renderDateInputs();
  populateCareInputs();
  calculateTotals();
  updateStepView();
}

function renderPetSelection() {
  const container = document.getElementById("bookingPetList");
  if (!container) return;

  const allPets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  // Filter registered pets for current authenticated user, fallback to available pets if none match
  let pets = allPets.filter(p => p.ownerId === bookingState.ownerId || p.ownerEmail === bookingState.ownerEmail);
  if (!pets.length) {
    pets = allPets;
  }

  if (!pets.length) {
    container.innerHTML = `<p class="text-sm text-[var(--text-muted)] col-span-2">No registered pets found. Please click "Add New Pet" above.</p>`;
    return;
  }

  if (!bookingState.petId || !pets.some(p => p.id === bookingState.petId)) {
    bookingState.petId = pets[0].id;
    bookingState.petName = pets[0].name;
    bookingState.petBreed = pets[0].breed;
    bookingState.petSpecies = pets[0].species;
    bookingState.petWeight = pets[0].weight;
  }

  container.innerHTML = pets.map(pet => `
    <div onclick="selectExistingPet('${pet.id}')" class="p-3.5 sm:p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3 sm:gap-4 ${bookingState.petId === pet.id ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)]/40'}">
      <img src="${pet.avatar}" alt="${pet.name}" class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-black/10 flex-shrink-0">
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-1">
          <h4 class="font-bold text-sm sm:text-base text-[var(--text-main)] truncate">${pet.name}</h4>
          <span class="badge-pet badge-teal text-[10px] flex-shrink-0">${pet.species}</span>
        </div>
        <p class="text-xs text-[var(--text-muted)] truncate">${pet.breed} • ${pet.age} • ${pet.weight}</p>
        <p class="text-[11px] text-emerald-600 font-semibold mt-1 truncate"><i class="bi bi-shield-check"></i> Vaccines ${pet.vaccinationStatus}</p>
      </div>
      <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${bookingState.petId === pet.id ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white' : 'border-[var(--border-color)]'}">
        ${bookingState.petId === pet.id ? '<i class="bi bi-check text-sm"></i>' : ''}
      </div>
    </div>
  `).join('');
}

function selectExistingPet(petId) {
  const pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  const pet = pets.find(p => p.id === petId);
  if (pet) {
    bookingState.petType = "existing";
    bookingState.petId = pet.id;
    bookingState.petName = pet.name;
    bookingState.petBreed = pet.breed;
    bookingState.petSpecies = pet.species;
    bookingState.petWeight = pet.weight;
    renderPetSelection();
    calculateTotals();
  }
}

function toggleNewPetForm(show) {
  const form = document.getElementById("newPetFormContainer");
  const existingContainer = document.getElementById("bookingPetList");
  if (!form) return;

  if (show) {
    form.classList.remove("hidden");
    if (existingContainer) existingContainer.classList.add("opacity-40", "pointer-events-none");
    bookingState.petType = "new";
  } else {
    form.classList.add("hidden");
    if (existingContainer) existingContainer.classList.remove("opacity-40", "pointer-events-none");
    bookingState.petType = "existing";
  }
}

function renderServiceSelection() {
  const container = document.getElementById("bookingServiceList");
  if (!container) return;

  const services = JSON.parse(localStorage.getItem("paws_services") || "[]");
  container.innerHTML = services.slice(0, 6).map(srv => `
    <div onclick="selectBookingService('${srv.id}', '${srv.title}', ${srv.price})" class="p-3.5 sm:p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between overflow-hidden group ${bookingState.serviceId === srv.id ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)]/40'}">
      <div class="flex items-start gap-3.5 mb-2">
        <img src="${srv.image}" alt="${srv.title}" class="w-16 h-16 rounded-xl object-cover border border-[var(--border-color)] group-hover:scale-105 transition-transform flex-shrink-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 mb-0.5">
            <span class="text-xs text-[var(--brand-primary)]"><i class="bi ${srv.icon}"></i></span>
            <h4 class="font-bold text-sm text-[var(--text-main)] truncate">${srv.title}</h4>
          </div>
          <p class="text-xs text-[var(--text-muted)] line-clamp-2">${srv.shortDesc}</p>
        </div>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-[var(--border-color)] mt-auto">
        <span class="text-xs font-bold text-[var(--brand-accent)]">$${srv.price} <span class="font-normal text-[var(--text-muted)]">${srv.priceUnit || '/ unit'}</span></span>
        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${bookingState.serviceId === srv.id ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white' : 'border-[var(--border-color)]'}">
          ${bookingState.serviceId === srv.id ? '<i class="bi bi-check text-xs"></i>' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function selectBookingService(id, title, price) {
  bookingState.serviceId = id;
  bookingState.serviceName = title;
  bookingState.baseRate = price;
  renderServiceSelection();
  calculateTotals();
}

function selectSuiteTier(tierName, extraPrice) {
  bookingState.suiteTier = tierName;
  bookingState.suiteExtra = extraPrice;

  document.querySelectorAll('.suite-tier-card').forEach(card => {
    if (card.dataset.tier === tierName) {
      card.classList.add('border-[var(--brand-accent)]', 'bg-[var(--brand-accent)]/5');
      card.classList.remove('border-[var(--border-color)]');
    } else {
      card.classList.remove('border-[var(--brand-accent)]', 'bg-[var(--brand-accent)]/5');
      card.classList.add('border-[var(--border-color)]');
    }
  });

  calculateTotals();
}

function renderDateInputs() {
  const checkInInput = document.getElementById("bookingCheckInDate");
  const checkOutInput = document.getElementById("bookingCheckOutDate");
  
  const now = new Date();
  const formatLocal = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const todayStr = formatLocal(now);

  const getNextDay = (dateStr) => {
    if (!dateStr || !dateStr.includes("-")) return formatLocal(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
    const parts = dateStr.split("-").map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2] + 1);
    return formatLocal(d);
  };

  if (checkInInput) {
    checkInInput.value = bookingState.checkInDate || todayStr;
    checkInInput.min = todayStr;

    const onCheckInChange = (e) => {
      bookingState.checkInDate = e.target.value;
      if (!bookingState.checkInDate) return;
      
      const nextDayStr = getNextDay(bookingState.checkInDate);
      if (checkOutInput) {
        checkOutInput.min = nextDayStr;
        if (!bookingState.checkOutDate || bookingState.checkOutDate <= bookingState.checkInDate) {
          bookingState.checkOutDate = nextDayStr;
          checkOutInput.value = nextDayStr;
        }
      }
      calculateTotals();
    };

    checkInInput.addEventListener("change", onCheckInChange);
    checkInInput.addEventListener("input", onCheckInChange);
  }

  if (checkOutInput) {
    checkOutInput.value = bookingState.checkOutDate || getNextDay(bookingState.checkInDate);
    if (bookingState.checkInDate) {
      checkOutInput.min = getNextDay(bookingState.checkInDate);
    }

    checkOutInput.addEventListener("change", (e) => {
      if (bookingState.checkInDate && e.target.value <= bookingState.checkInDate) {
        const nextDayStr = getNextDay(bookingState.checkInDate);
        bookingState.checkOutDate = nextDayStr;
        e.target.value = nextDayStr;
        if (typeof showToast === "function") {
          showToast("Check-out date must be after check-in date.", "info");
        }
      } else {
        bookingState.checkOutDate = e.target.value;
      }
      calculateTotals();
    });
  }
}

function toggleAddOn(name, price) {
  const existing = bookingState.addOns.find(a => a.name === name);
  if (existing) {
    bookingState.addOns = bookingState.addOns.filter(a => a.name !== name);
  } else {
    bookingState.addOns.push({ name, price });
  }
  calculateTotals();
}

function calculateTotals() {
  const d1 = new Date(bookingState.checkInDate);
  const d2 = new Date(bookingState.checkOutDate);
  let diffTime = d2 - d1;
  let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (isNaN(days) || days < 1) days = 1;
  bookingState.days = days;

  // Daily rate = Base rate + Suite Tier extra
  const dailyRate = bookingState.baseRate + bookingState.suiteExtra;
  let subtotal = dailyRate * days;

  // Add-ons
  const addOnsTotal = bookingState.addOns.reduce((sum, item) => sum + item.price, 0);
  subtotal += addOnsTotal;

  // Long stay discount if >= 7 days (15%)
  let discount = 0;
  if (days >= 7) {
    discount = subtotal * 0.15;
  }

  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + tax;

  bookingState.subtotal = subtotal;
  bookingState.discount = discount;
  bookingState.tax = tax;
  bookingState.total = total;

  // Update summary DOM
  updateSummaryUI();
}

function populateCareInputs() {
  const feedEl = document.getElementById("bookingFeedingNotes");
  const medEl = document.getElementById("bookingMedicationNotes");
  const emEl = document.getElementById("bookingEmergencyContact");
  const phoneEl = document.getElementById("bookingOwnerPhone");

  if (feedEl && !feedEl.value) feedEl.value = bookingState.feedingNotes;
  if (medEl && !medEl.value) medEl.value = bookingState.medicationNotes;
  if (emEl && !emEl.value) emEl.value = bookingState.emergencyContact;
  if (phoneEl) {
    if (!phoneEl.value) phoneEl.value = bookingState.ownerPhone;
    phoneEl.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9+\-() ]/g, '').replace(/\s{2,}/g, ' ');
    });
  }
}

function updateSummaryUI() {
  const petNameElem = document.getElementById("sumPetName");
  const serviceElem = document.getElementById("sumService");
  const suiteElem = document.getElementById("sumSuite");
  const datesElem = document.getElementById("sumDates");
  const durationElem = document.getElementById("sumDuration");
  const subtotalElem = document.getElementById("sumSubtotal");
  const discountElem = document.getElementById("sumDiscount");
  const taxElem = document.getElementById("sumTax");
  const totalElem = document.getElementById("sumTotal");
  const ownerNameElem = document.getElementById("sumOwnerName");
  const ownerEmailElem = document.getElementById("sumOwnerEmail");
  const ownerPhoneElem = document.getElementById("sumOwnerPhone");

  if (petNameElem) petNameElem.textContent = `${bookingState.petName} (${bookingState.petBreed})`;
  if (serviceElem) serviceElem.textContent = bookingState.serviceName;
  if (suiteElem) suiteElem.textContent = bookingState.suiteTier;
  if (datesElem) datesElem.textContent = `${bookingState.checkInDate} to ${bookingState.checkOutDate}`;
  if (durationElem) durationElem.textContent = `${bookingState.days} Night${bookingState.days > 1 ? 's' : ''}`;
  if (subtotalElem) subtotalElem.textContent = `$${bookingState.subtotal.toFixed(2)}`;
  if (ownerNameElem) ownerNameElem.textContent = bookingState.ownerName;
  if (ownerEmailElem) ownerEmailElem.textContent = `${bookingState.ownerEmail} (${bookingState.ownerId || 'usr-01'})`;
  if (ownerPhoneElem) ownerPhoneElem.textContent = bookingState.ownerPhone;

  if (discountElem) {
    if (bookingState.discount > 0) {
      discountElem.textContent = `-$${bookingState.discount.toFixed(2)} (15% Long Stay)`;
      discountElem.parentElement.classList.remove('hidden');
    } else {
      discountElem.parentElement.classList.add('hidden');
    }
  }
  if (taxElem) taxElem.textContent = `$${bookingState.tax.toFixed(2)}`;
  if (totalElem) totalElem.textContent = `$${bookingState.total.toFixed(2)}`;
}

function nextBookingStep() {
  if (bookingState.step === 1 && bookingState.petType === "new") {
    const newName = document.getElementById("newPetName")?.value.trim();
    const newBreed = document.getElementById("newPetBreed")?.value.trim();
    const newSpecies = document.getElementById("newPetSpecies")?.value || "Dog";
    const rawAge = document.getElementById("newPetAge")?.value.replace(/\D/g, '').trim();
    const rawWeight = document.getElementById("newPetWeight")?.value.replace(/\D/g, '').trim();
    const newAge = rawAge ? `${rawAge} years` : "2 years";
    const newWeight = rawWeight ? `${rawWeight} lbs` : "30 lbs";
    if (!newName || !newBreed) {
      showToast("Please enter your pet's name and breed", "error");
      return;
    }
    bookingState.petName = newName;
    bookingState.petBreed = newBreed;
    bookingState.petSpecies = newSpecies;
    bookingState.petAge = newAge;
    bookingState.petWeight = newWeight;
  }

  // Gather care & contact inputs when advancing from Step 4
  if (bookingState.step === 4) {
    const feedEl = document.getElementById("bookingFeedingNotes");
    const medEl = document.getElementById("bookingMedicationNotes");
    const emEl = document.getElementById("bookingEmergencyContact");
    const phoneEl = document.getElementById("bookingOwnerPhone");

    const phoneVal = phoneEl ? phoneEl.value.trim() : "";
    const digitsOnly = phoneVal.replace(/\D/g, "");

    if (!phoneVal || digitsOnly.length < 7 || /[a-zA-Z]/.test(phoneVal) || phoneVal.includes(' ')) {
      if (typeof showToast === "function") {
        if (phoneVal.includes(' ')) {
          showToast("Owner contact phone cannot contain spaces.", "error");
        } else {
          showToast("Please enter a valid owner contact phone number (minimum 7 digits, numbers only).", "error");
        }
      }
      if (phoneEl) phoneEl.focus();
      return;
    }

    if (feedEl && feedEl.value.trim()) bookingState.feedingNotes = feedEl.value.trim();
    if (medEl && medEl.value.trim()) bookingState.medicationNotes = medEl.value.trim();
    if (emEl && emEl.value.trim()) bookingState.emergencyContact = emEl.value.trim();
    bookingState.ownerPhone = phoneVal;
  }

  if (bookingState.step < 5) {
    bookingState.step++;
    calculateTotals();
    updateStepView();
  }
}

function prevBookingStep() {
  if (bookingState.step > 1) {
    bookingState.step--;
    updateStepView();
  }
}

function updateStepView() {
  // Hide all step containers
  for (let i = 1; i <= 5; i++) {
    const stepEl = document.getElementById(`bookingStep${i}`);
    if (stepEl) {
      if (i === bookingState.step) {
        stepEl.classList.remove("hidden");
      } else {
        stepEl.classList.add("hidden");
      }
    }
  }

  // Update wizard progress indicator nodes
  document.querySelectorAll(".wizard-step-node").forEach(node => {
    const stepNum = parseInt(node.dataset.step, 10);
    if (stepNum < bookingState.step) {
      node.className = "wizard-step-node w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md";
      node.innerHTML = '<i class="bi bi-check-lg"></i>';
    } else if (stepNum === bookingState.step) {
      node.className = "wizard-step-node w-10 h-10 rounded-full bg-[var(--brand-accent)] text-white flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-[var(--brand-accent)]/20";
      node.innerHTML = stepNum;
    } else {
      node.className = "wizard-step-node w-10 h-10 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)] flex items-center justify-center font-bold text-sm";
      node.innerHTML = stepNum;
    }
  });

  // Step title update
  const stepTitles = [
    "Step 1: Select or Register Your Pet",
    "Step 2: Choose Service & Suite Accommodation",
    "Step 3: Select Check-in & Check-out Dates",
    "Step 4: Care, Feeding & Veterinary Instructions",
    "Step 5: Review & Reserve Stay"
  ];
  const titleElem = document.getElementById("bookingStepTitle");
  if (titleElem) titleElem.textContent = stepTitles[bookingState.step - 1];

  // Update Previous Step button state (half shade when on step 1 with no previous step)
  const prevBtn = document.getElementById("btnWizardPrev");
  const prevContainer = document.getElementById("btnWizardPrevContainer");
  if (prevBtn) {
    if (bookingState.step <= 1) {
      prevBtn.disabled = true;
      prevBtn.setAttribute("aria-disabled", "true");
      prevBtn.classList.add("btn-disabled", "opacity-40", "pointer-events-none", "cursor-not-allowed");
      if (prevContainer) {
        prevContainer.classList.add("opacity-40", "pointer-events-none", "cursor-not-allowed");
      }
    } else {
      prevBtn.disabled = false;
      prevBtn.removeAttribute("aria-disabled");
      prevBtn.classList.remove("btn-disabled", "opacity-40", "pointer-events-none", "cursor-not-allowed");
      if (prevContainer) {
        prevContainer.classList.remove("opacity-40", "pointer-events-none", "cursor-not-allowed");
      }
    }
  }

  window.scrollTo({ top: 180, behavior: 'smooth' });
}

function completeBooking() {
  // Generate unique booking ID
  const bookingId = "STAY-" + Math.floor(1000 + Math.random() * 9000);
  const invoiceId = "INV-2026-" + Math.floor(1000 + Math.random() * 9000);

  // If user registered a new pet, save pet to LocalStorage
  let pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  if (bookingState.petType === "new") {
    const newPetObj = {
      id: "pet-" + Date.now().toString().slice(-4),
      name: bookingState.petName,
      species: bookingState.petSpecies,
      breed: bookingState.petBreed,
      gender: "Not specified",
      age: bookingState.petAge || "Adult",
      weight: bookingState.petWeight || "Medium",
      avatar: bookingState.petSpecies === "Cat"
        ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80"
        : "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80",
      ownerId: bookingState.ownerId || "usr-01",
      ownerName: bookingState.ownerName,
      ownerEmail: bookingState.ownerEmail,
      ownerPhone: bookingState.ownerPhone,
      vaccinationStatus: "Verified Up to Date",
      vaccinationExpiry: "2027-04-01",
      specialNotes: bookingState.feedingNotes,
      emergencyContact: bookingState.emergencyContact,
      activeStayId: bookingId
    };
    pets.push(newPetObj);
    localStorage.setItem("paws_pets", JSON.stringify(pets));
    bookingState.petId = newPetObj.id;
  }

  // Create Stay Object linked to the authenticated user
  const newStay = {
    id: bookingId,
    petId: bookingState.petId,
    petName: bookingState.petName,
    petPhoto: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
    breed: bookingState.petBreed,
    serviceName: bookingState.serviceName,
    suite: bookingState.suiteTier,
    checkInDate: bookingState.checkInDate,
    checkOutDate: bookingState.checkOutDate,
    stageIndex: 1, // 1: Checked In
    status: "Confirmed",
    assignedCaretaker: "Jessica Miller (Lead Caretaker)",
    latestNote: "Reservation confirmed. Suite prepped with fresh linens & filtered water.",
    ownerId: bookingState.ownerId || "usr-01",
    ownerName: bookingState.ownerName,
    ownerEmail: bookingState.ownerEmail,
    ownerPhone: bookingState.ownerPhone,
    amount: bookingState.total,
    paymentStatus: "Paid",
    webcamActive: true
  };

  let stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");
  stays.unshift(newStay);
  localStorage.setItem("paws_stays", JSON.stringify(stays));

  // Create complete Invoice linked to user and stay
  const newInvoice = {
    id: invoiceId,
    bookingId: bookingId,
    date: new Date().toISOString().split("T")[0],
    issueDateStr: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    petName: bookingState.petName,
    petBreed: bookingState.petBreed || "Family Pet",
    petSpecies: bookingState.petSpecies || "Dog",
    petWeight: bookingState.petWeight || "Medium",
    service: `${bookingState.serviceName} (${bookingState.days} Nights) in ${bookingState.suiteTier}`,
    serviceName: bookingState.serviceName,
    suiteTier: bookingState.suiteTier,
    days: bookingState.days,
    baseRate: bookingState.baseRate,
    suiteExtra: bookingState.suiteExtra,
    dailyRate: bookingState.baseRate + bookingState.suiteExtra,
    checkInDate: bookingState.checkInDate,
    checkInTime: bookingState.checkInTime || "09:00 AM – 11:00 AM",
    checkOutDate: bookingState.checkOutDate,
    checkOutTime: bookingState.checkOutTime || "03:00 PM – 05:00 PM",
    addOns: bookingState.addOns || [],
    subtotal: bookingState.subtotal,
    discount: bookingState.discount || 0,
    tax: bookingState.tax,
    total: bookingState.total,
    status: "Paid",
    paymentMethod: "Visa ending in 4242",
    customerName: bookingState.ownerName,
    customerEmail: bookingState.ownerEmail,
    customerPhone: bookingState.ownerPhone
  };

  let invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
  invoices.unshift(newInvoice);
  localStorage.setItem("paws_invoices", JSON.stringify(invoices));
  sessionStorage.setItem("paws_latest_invoice", JSON.stringify(newInvoice));

  // Show Success Confirmation Modal
  const successModal = document.getElementById("bookingSuccessModal");
  if (successModal) {
    document.getElementById("successBookingId").textContent = bookingId;
    document.getElementById("successPetName").textContent = bookingState.petName;
    document.getElementById("successStayDates").textContent = `${bookingState.checkInDate} to ${bookingState.checkOutDate}`;
    document.getElementById("successTotalAmount").textContent = `$${bookingState.total.toFixed(2)}`;
    
    // Set direct links
    document.getElementById("btnTrackStay").onclick = () => {
      window.location.href = `stay-tracking.html?id=${bookingId}`;
    };
    document.getElementById("btnGoUserDashboard").onclick = () => {
      window.location.href = `user.html`;
    };

    // Wire up Bill Copy Download and Print buttons
    const btnDownload = document.getElementById("btnDownloadBill");
    if (btnDownload) {
      btnDownload.onclick = () => downloadBookingBill(newInvoice);
    }
    const btnPrint = document.getElementById("btnPrintBill");
    if (btnPrint) {
      btnPrint.onclick = () => printBookingBill(newInvoice);
    }

    openModal("bookingSuccessModal");
  }

  showToast(`🎉 Reservation ${bookingId} confirmed successfully!`, "success", 5000);
}

// ---------------------------------------------------------------------------
// Bill Copy & Invoice Download Engine
// ---------------------------------------------------------------------------
function generateBookingBillHtml(inv, isAutoPrint = false) {
  const stayDays = inv.days || 1;
  const dailyRate = inv.dailyRate || (inv.baseRate + (inv.suiteExtra || 0)) || 59;
  const suiteTotal = dailyRate * stayDays;

  const addOnsRows = (inv.addOns && inv.addOns.length > 0)
    ? inv.addOns.map(a => `
      <tr>
        <td>
          <strong>${a.name}</strong><br>
          <span style="font-size:11px; color:#6b7280;">Specialized Care / Add-on Service</span>
        </td>
        <td style="text-align:center; color:#059669; font-weight:600;">Active</td>
        <td style="text-align:right; font-weight:700;">$${Number(a.price).toFixed(2)}</td>
      </tr>
    `).join('')
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Bill Copy - ${inv.bookingId} - PawsHaven</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <style>
    @page {
      size: portrait;
      margin: 12mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111827;
      background-color: ${isAutoPrint ? '#ffffff' : '#f3f4f6'};
      padding: ${isAutoPrint ? '0' : '24px 16px'};
      line-height: 1.5;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @media print {
      body {
        background-color: #ffffff !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .bill-container {
        border: 1px solid #d1d5db !important;
        box-shadow: none !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 24px !important;
      }
    }
    .top-actions {
      max-width: 800px;
      margin: 0 auto 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-action {
      background: #1B4D3E;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .btn-action:hover {
      opacity: 0.9;
    }
    .btn-secondary {
      background: #ffffff;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .btn-secondary:hover {
      background: #f9fafb;
    }
    .bill-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      padding: 32px 36px;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f3f4f6;
      padding-bottom: 20px;
      margin-bottom: 24px;
      gap: 16px;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      color: #1B4D3E;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 11px;
      color: #6b7280;
    }
    .badge-paid {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .inv-id {
      font-size: 15px;
      font-weight: 900;
      font-family: monospace;
      color: #1f2937;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }
    .meta-box {
      background: #f9fafb;
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 14px;
      font-size: 12px;
    }
    .meta-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1B4D3E;
      margin-bottom: 6px;
    }
    table.invoice-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }
    table.invoice-table th {
      background: #f9fafb;
      color: #374151;
      font-weight: 800;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 10px 14px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }
    table.invoice-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #f3f4f6;
      color: #1f2937;
    }
    .subtotal-row td {
      background: #fafafa;
      font-weight: 700;
      border-bottom: 1px solid #e5e7eb;
    }
    .total-row td {
      background: #ecfdf5;
      color: #064e3b;
      font-weight: 900;
      font-size: 16px;
      border-top: 2px solid #10b981;
    }
    .footer-seal {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #6b7280;
    }
    .auth-ref {
      font-family: monospace;
      font-size: 11px;
      font-weight: 800;
      color: #1B4D3E;
    }
    @media (max-width: 640px) {
      .meta-grid { grid-template-columns: 1fr; }
      .header-row { flex-direction: column; }
    }
  </style>
</head>
<body>
  ${!isAutoPrint ? `
  <div class="top-actions no-print">
    <div style="font-size: 12px; color: #4b5563; font-weight: 700;">
      <i class="bi bi-patch-check-fill" style="color:#059669;"></i> Official PawsHaven Paid Bill Copy
    </div>
    <div style="display:flex; gap:8px;">
      <button class="btn-action" onclick="window.print()">
        <i class="bi bi-printer-fill"></i> Print / Save as PDF
      </button>
      <button class="btn-action btn-secondary" onclick="window.close()">
        <i class="bi bi-x-lg"></i> Close
      </button>
    </div>
  </div>` : ''}

  <div class="bill-container">
    <!-- Header -->
    <div class="header-row">
      <div class="brand-group">
        <div style="width:44px;height:44px;border-radius:12px;background:#1B4D3E;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:900;">
          🐾
        </div>
        <div>
          <h1 class="brand-title">PawsHaven Resort &amp; Daycare</h1>
          <p class="brand-sub">Licensed &amp; Insured Luxury Pet Hospitality • Austin, TX</p>
        </div>
      </div>
      <div style="text-align: right;">
        <span class="badge-paid">
          <i class="bi bi-check-circle-fill"></i> Paid in Full
        </span>
        <div style="font-size:10px; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em;">Receipt / Invoice #</div>
        <div class="inv-id">${inv.id}</div>
      </div>
    </div>

    <!-- Meta Details Grid -->
    <div class="meta-grid">
      <!-- Billed To -->
      <div class="meta-box">
        <div class="meta-label">Billed To (Pet Parent)</div>
        <div style="font-weight:800; font-size:13px; color:#111827;">${inv.customerName}</div>
        <div style="color:#4b5563; font-size:11px; word-break:break-all;">${inv.customerEmail}</div>
        <div style="color:#4b5563; font-size:11px;">${inv.customerPhone}</div>
      </div>

      <!-- Pet Guest Info -->
      <div class="meta-box">
        <div class="meta-label">Pet Guest Details</div>
        <div style="font-weight:800; font-size:13px; color:#111827;">${inv.petName}</div>
        <div style="color:#4b5563; font-size:11px;">${inv.petBreed || 'Pet'} • ${inv.petSpecies || 'Dog'}</div>
        <div style="color:#4b5563; font-size:11px;">Weight: ${inv.petWeight || 'Medium'}</div>
      </div>

      <!-- Stay Schedule -->
      <div class="meta-box">
        <div class="meta-label">Reservation Schedule</div>
        <div style="font-weight:700; color:#111827;">Ref: <span style="font-family:monospace; color:#1B4D3E;">${inv.bookingId}</span></div>
        <div style="color:#4b5563; font-size:11px; margin-top:2px;">Check-in: <strong>${inv.checkInDate}</strong> (${inv.checkInTime})</div>
        <div style="color:#4b5563; font-size:11px;">Check-out: <strong>${inv.checkOutDate}</strong> (${inv.checkOutTime})</div>
      </div>
    </div>

    <!-- Itemized Services Table -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Service / Description</th>
          <th style="text-align:center; width:90px;">Status</th>
          <th style="text-align:right; width:110px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong style="color:#111827;">${inv.serviceName}</strong><br>
            <span style="font-size:11px; color:#6b7280;">Suite Tier: <strong>${inv.suiteTier}</strong> (${stayDays} Night${stayDays > 1 ? 's' : ''} @ $${dailyRate.toFixed(2)}/night)</span>
          </td>
          <td style="text-align:center; color:#059669; font-weight:700;">Confirmed</td>
          <td style="text-align:right; font-weight:700;">$${suiteTotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>
            <strong>Daily Nutritional Feeding &amp; Dietary Protocol</strong><br>
            <span style="font-size:11px; color:#6b7280;">Continuous filtered water &amp; chef-inspected pet meal schedule</span>
          </td>
          <td style="text-align:center; color:#059669; font-weight:700;">Included</td>
          <td style="text-align:right; color:#6b7280; font-weight:700;">$0.00</td>
        </tr>
        <tr>
          <td>
            <strong>Play Yard Agility &amp; 24/7 HD Webcam Live Stream</strong><br>
            <span style="font-size:11px; color:#6b7280;">Private owner camera portal with live streaming video feed</span>
          </td>
          <td style="text-align:center; color:#059669; font-weight:700;">Included</td>
          <td style="text-align:right; color:#6b7280; font-weight:700;">$0.00</td>
        </tr>
        ${addOnsRows}
        <tr class="subtotal-row">
          <td colspan="2" style="text-align:right; color:#4b5563;">Subtotal</td>
          <td style="text-align:right; font-weight:700;">$${inv.subtotal.toFixed(2)}</td>
        </tr>
        ${inv.discount > 0 ? `
        <tr class="subtotal-row">
          <td colspan="2" style="text-align:right; color:#059669;">Extended Stay Discount (15%)</td>
          <td style="text-align:right; font-weight:700; color:#059669;">-$${inv.discount.toFixed(2)}</td>
        </tr>` : ''}
        <tr class="subtotal-row">
          <td colspan="2" style="text-align:right; color:#4b5563;">State &amp; Resort Environmental Tax (8%)</td>
          <td style="text-align:right; font-weight:700;">$${inv.tax.toFixed(2)}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="text-align:right; padding:14px;">Total Amount Paid (${inv.paymentMethod})</td>
          <td style="text-align:right; padding:14px; font-size:18px;">$${inv.total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Official Seal & Footer -->
    <div class="footer-seal">
      <div>
        <div style="font-weight:800; color:#111827; font-size:12px;">Verified Official Digital Bill &amp; Receipt</div>
        <div style="font-size:10px; color:#6b7280; margin-top:2px;">
          PawsHaven Resort • 4820 Paws Meadow Blvd, Austin, TX 78704 • (555) PAW-STAY • Full refund up to 48h prior to check-in.
        </div>
      </div>
      <div class="auth-ref">
        AUTH #TX-${inv.bookingId.replace('STAY-', '')}-PAID
      </div>
    </div>
  </div>
</body>
</html>`;
}

function downloadBookingBill(inv) {
  if (!inv) {
    const saved = sessionStorage.getItem("paws_latest_invoice");
    if (saved) {
      try { inv = JSON.parse(saved); } catch (e) {}
    }
  }
  if (!inv) {
    const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
    inv = invoices[0];
  }
  if (!inv) {
    showToast("No bill copy found to download.", "error");
    return;
  }

  const htmlContent = generateBookingBillHtml(inv, false);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PawsHaven-Bill-${inv.bookingId || "STAY"}-${inv.petName || "Guest"}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (typeof showToast === "function") {
    showToast(`📄 Bill copy for ${inv.bookingId} downloaded successfully!`, "success");
  }
}

function printBookingBill(inv) {
  if (!inv) {
    const saved = sessionStorage.getItem("paws_latest_invoice");
    if (saved) {
      try { inv = JSON.parse(saved); } catch (e) {}
    }
  }
  if (!inv) {
    const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
    inv = invoices[0];
  }
  if (!inv) {
    showToast("No bill copy found to print.", "error");
    return;
  }

  const fullHtml = generateBookingBillHtml(inv, true);

  let frame = document.getElementById("paws-booking-print-iframe");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "paws-booking-print-iframe";
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "none";
    document.body.appendChild(frame);
  }

  const frameDoc = frame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(fullHtml);
  frameDoc.close();

  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }, 250);
}

// Bind global handlers on page load if modal exists
document.addEventListener("DOMContentLoaded", () => {
  const btnDownload = document.getElementById("btnDownloadBill");
  if (btnDownload) {
    btnDownload.addEventListener("click", () => downloadBookingBill());
  }
  const btnPrint = document.getElementById("btnPrintBill");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => printBookingBill());
  }
});
