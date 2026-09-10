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
  ownerPhone: "+1 (555) 234-5678"
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
  bookingState.ownerPhone = currentUser.phone || "+1 (555) 234-5678";

  // Update Auth Banner in Wizard
  const greetingEl = document.getElementById("authUserGreeting");
  const badgeEl = document.getElementById("authRoleBadge");
  const emailEl = document.getElementById("authUserEmail");
  if (greetingEl) greetingEl.textContent = `Logged in as ${currentUser.name}`;
  if (badgeEl) badgeEl.textContent = "Pet Parent";
  if (emailEl) emailEl.textContent = `${currentUser.email} • ID: ${currentUser.id || 'usr-01'}`;

  // Set default dates: tomorrow to +4 days
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkout = new Date();
  checkout.setDate(checkout.getDate() + 4);

  const formatDate = (d) => d.toISOString().split("T")[0];
  bookingState.checkInDate = formatDate(tomorrow);
  bookingState.checkOutDate = formatDate(checkout);

  // Check preset from sessionStorage
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
    <div onclick="selectExistingPet('${pet.id}')" class="p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-4 ${bookingState.petId === pet.id ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)]/40'}">
      <img src="${pet.avatar}" alt="${pet.name}" class="w-14 h-14 rounded-2xl object-cover border border-black/10">
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-base text-[var(--text-main)]">${pet.name}</h4>
          <span class="badge-pet badge-teal text-[10px]">${pet.species}</span>
        </div>
        <p class="text-xs text-[var(--text-muted)]">${pet.breed} • ${pet.age} • ${pet.weight}</p>
        <p class="text-[11px] text-emerald-600 font-semibold mt-1"><i class="bi bi-shield-check"></i> Vaccines ${pet.vaccinationStatus}</p>
      </div>
      <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center ${bookingState.petId === pet.id ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white' : 'border-[var(--border-color)]'}">
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
  if (checkInInput) {
    checkInInput.value = bookingState.checkInDate;
    checkInInput.addEventListener("change", (e) => {
      bookingState.checkInDate = e.target.value;
      calculateTotals();
    });
  }
  if (checkOutInput) {
    checkOutInput.value = bookingState.checkOutDate;
    checkOutInput.addEventListener("change", (e) => {
      bookingState.checkOutDate = e.target.value;
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
  if (phoneEl) phoneEl.value = bookingState.ownerPhone;
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
    const newAge = document.getElementById("newPetAge")?.value.trim() || "2 years";
    const newWeight = document.getElementById("newPetWeight")?.value.trim() || "30 lbs";
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

    if (feedEl && feedEl.value.trim()) bookingState.feedingNotes = feedEl.value.trim();
    if (medEl && medEl.value.trim()) bookingState.medicationNotes = medEl.value.trim();
    if (emEl && emEl.value.trim()) bookingState.emergencyContact = emEl.value.trim();
    if (phoneEl && phoneEl.value.trim()) bookingState.ownerPhone = phoneEl.value.trim();
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

  // Create Invoice linked to user
  const newInvoice = {
    id: invoiceId,
    bookingId: bookingId,
    date: new Date().toISOString().split("T")[0],
    petName: bookingState.petName,
    service: `${bookingState.serviceName} (${bookingState.days} Nights) in ${bookingState.suiteTier}`,
    subtotal: bookingState.subtotal,
    tax: bookingState.tax,
    total: bookingState.total,
    status: "Paid",
    paymentMethod: "Visa ending in 4242",
    customerName: bookingState.ownerName,
    customerEmail: bookingState.ownerEmail
  };

  let invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
  invoices.unshift(newInvoice);
  localStorage.setItem("paws_invoices", JSON.stringify(invoices));

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

    openModal("bookingSuccessModal");
  }

  showToast(`🎉 Reservation ${bookingId} confirmed successfully!`, "success", 5000);
}
