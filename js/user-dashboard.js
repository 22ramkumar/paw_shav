/**
 * PawsHaven - Pet Owner Dashboard Controller (user.html)
 * Handles section tabs, Pet CRUD, Activity logs, Health reports, Photo feed, Invoices & Printing.
 */

document.addEventListener("DOMContentLoaded", () => {
  initUserDashboard();
});

function initUserDashboard() {
  // Check hash for direct tab navigation
  const hash = window.location.hash.replace("#", "") || "overview";
  switchUserTab(hash);

  renderUserOverview();
  renderMyPetsList();
  renderActiveStayTracker();
  renderUserReminders();
  renderDailyLogsList();
  renderHealthReports();
  renderUserPhotos();
  renderInvoicesTable();
}

// ---------------------------------------------------------------------------
// 1. Tab Switching
// ---------------------------------------------------------------------------
function switchUserTab(tabId) {
  // Hide all user tabs
  document.querySelectorAll(".user-tab-content").forEach(el => el.classList.add("hidden"));
  
  // Show target tab
  const target = document.getElementById(`tab-${tabId}`);
  if (target) {
    target.classList.remove("hidden");
  } else {
    document.getElementById("tab-overview")?.classList.remove("hidden");
  }

  // Update sidebar active link state
  document.querySelectorAll(".user-nav-link").forEach(link => {
    if (link.dataset.tab === tabId) {
      link.className = "user-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--brand-primary)] text-white font-bold transition shadow-sm";
    } else {
      link.className = "user-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold transition";
    }
  });

  // Mobile sidebar close if open
  const sidebar = document.getElementById("userSidebar");
  const overlay = document.getElementById("userSidebarOverlay");
  if (sidebar && overlay && !overlay.classList.contains("hidden")) {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------------------------------------------------------------------------
// 2. Overview Tab Renderer
// ---------------------------------------------------------------------------
function renderUserOverview() {
  const stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");
  const pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");

  const activeStay = stays.find(s => s.status !== "Completed" && s.status !== "Cancelled") || stays[0];

  const statStays = document.getElementById("statTotalStays");
  const statPets = document.getElementById("statTotalPets");
  const statSpent = document.getElementById("statTotalSpent");
  const statNext = document.getElementById("statNextStay");

  if (statStays) statStays.textContent = stays.length;
  if (statPets) statPets.textContent = pets.length;
  if (statSpent) {
    const total = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    statSpent.textContent = `$${total.toFixed(0)}`;
  }
  if (statNext) {
    statNext.textContent = activeStay ? activeStay.checkInDate : "None Scheduled";
  }

  // Active stay snapshot card
  const stayCard = document.getElementById("overviewActiveStayCard");
  if (stayCard && activeStay) {
    stayCard.innerHTML = `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent)]/10 rounded-3xl border border-[var(--brand-primary)]/20 mb-8">
        <div class="flex items-center gap-4">
          <img src="${activeStay.petPhoto}" alt="${activeStay.petName}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-black text-[var(--text-main)]">${activeStay.petName}'s Current Stay</h3>
              <span class="badge-pet badge-coral text-[10px]">${activeStay.status}</span>
            </div>
            <p class="text-xs text-[var(--text-muted)] mt-0.5">${activeStay.serviceName} • ${activeStay.suite}</p>
            <p class="text-xs font-semibold text-[var(--brand-primary)] mt-1"><i class="bi bi-person-check-fill"></i> Caretaker: ${activeStay.assignedCaretaker}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button onclick="switchUserTab('tracking')" class="btn-brand-primary text-xs py-2.5 px-4 rounded-xl flex-1 sm:flex-initial">
            <i class="bi bi-radar"></i> View Live Progress
          </button>
          <a href="stay-tracking.html?id=${activeStay.id}" class="btn-brand-outline text-xs py-2.5 px-4 rounded-xl flex-1 sm:flex-initial">
            <i class="bi bi-camera-video"></i> Webcams
          </a>
        </div>
      </div>
    `;
  }

  // Overview reminders mini list
  const miniRemList = document.getElementById("overviewRemindersMiniList");
  if (miniRemList) {
    const reminders = getSavedReminders();
    const topReminders = reminders.slice(0, 2);
    miniRemList.innerHTML = topReminders.map(r => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-subtle)] text-xs">
        <div class="flex items-center gap-2.5">
          <i class="bi ${r.icon || 'bi-shield-check'} ${r.daysLeft <= 14 ? 'text-amber-500' : 'text-emerald-500'} text-base"></i>
          <div>
            <span class="font-bold text-[var(--text-main)]">${r.type}</span>
            <span class="text-[10px] text-[var(--text-muted)] block">${r.pet} • Due: ${r.dueDate}</span>
          </div>
        </div>
        <span class="badge-pet ${r.badgeClass || (r.daysLeft <= 14 ? 'badge-amber' : 'badge-teal')} text-[10px]">
          ${r.daysLeft <= 14 ? `In ${r.daysLeft}d` : 'Valid'}
        </span>
      </div>
    `).join('');
  }
}

// ---------------------------------------------------------------------------
// 3. My Pets Tab (Full CRUD)
// ---------------------------------------------------------------------------
function renderMyPetsList() {
  const container = document.getElementById("userPetsGrid");
  if (!container) return;

  const pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  if (!pets.length) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-color)]">
        <div class="w-16 h-16 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center text-2xl text-[var(--text-muted)] mx-auto mb-4">
          <i class="bi bi-heart"></i>
        </div>
        <h4 class="font-bold text-lg text-[var(--text-main)]">No Registered Pets</h4>
        <p class="text-xs text-[var(--text-muted)] mt-1 mb-6">Add your beloved furry family member to get started!</p>
        <button onclick="openAddPetModal()" class="btn-brand-accent text-xs py-2.5 px-5 rounded-xl">
          <i class="bi bi-plus-circle-fill"></i> Add Your First Pet
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = pets.map(pet => `
    <div class="card-paw p-6 flex flex-col justify-between">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <img src="${pet.avatar}" alt="${pet.name}" class="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-[var(--border-color)]">
          <div class="flex items-center gap-1.5">
            <button onclick="openEditPetModal('${pet.id}')" class="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition flex items-center justify-center text-xs" title="Edit Profile">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button onclick="deletePetConfirm('${pet.id}')" class="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] hover:bg-rose-600 hover:text-white transition flex items-center justify-center text-xs text-rose-500" title="Remove Pet">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2 mb-1">
          <h4 class="text-xl font-bold text-[var(--text-main)]">${pet.name}</h4>
          <span class="badge-pet badge-teal text-[10px]">${pet.species}</span>
        </div>
        <p class="text-xs text-[var(--text-muted)] mb-4">${pet.breed} • ${pet.age} • ${pet.weight}</p>

        <div class="space-y-2 text-xs border-t border-[var(--border-color)] pt-4 mb-4">
          <div class="flex items-center justify-between">
            <span class="text-[var(--text-muted)]">Vaccinations:</span>
            <span class="font-bold text-emerald-600 flex items-center gap-1">
              <i class="bi bi-shield-check"></i> ${pet.vaccinationStatus}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[var(--text-muted)]">Renew Expiry:</span>
            <span class="font-semibold text-[var(--text-main)]">${pet.vaccinationExpiry}</span>
          </div>
          <div class="flex items-start justify-between gap-2">
            <span class="text-[var(--text-muted)]">Care Notes:</span>
            <span class="font-medium text-[var(--text-main)] text-right text-[11px] line-clamp-2">${pet.specialNotes}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 pt-2">
        <button onclick="quickBookPet('${pet.id}')" class="btn-brand-accent text-xs py-2 px-4 rounded-xl flex-1 text-center font-bold">
          <i class="bi bi-calendar-plus"></i> Book Stay
        </button>
        <button onclick="switchUserTab('tracking')" class="btn-brand-outline text-xs py-2 px-3 rounded-xl">
          <i class="bi bi-activity"></i> Status
        </button>
      </div>
    </div>
  `).join('');
}

function openAddPetModal() {
  document.getElementById("petModalTitle").textContent = "Register New Pet";
  document.getElementById("petFormId").value = "";
  document.getElementById("petFormName").value = "";
  document.getElementById("petFormSpecies").value = "Dog";
  document.getElementById("petFormBreed").value = "";
  document.getElementById("petFormAge").value = "2 years";
  document.getElementById("petFormWeight").value = "35 lbs";
  document.getElementById("petFormNotes").value = "";
  document.getElementById("petFormVaccine").value = "Up to Date";
  openModal("petEditModal");
}

function openEditPetModal(petId) {
  const pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  const pet = pets.find(p => p.id === petId);
  if (!pet) return;

  document.getElementById("petModalTitle").textContent = `Edit ${pet.name}'s Profile`;
  document.getElementById("petFormId").value = pet.id;
  document.getElementById("petFormName").value = pet.name;
  document.getElementById("petFormSpecies").value = pet.species;
  document.getElementById("petFormBreed").value = pet.breed;
  document.getElementById("petFormAge").value = pet.age;
  document.getElementById("petFormWeight").value = pet.weight;
  document.getElementById("petFormNotes").value = pet.specialNotes;
  document.getElementById("petFormVaccine").value = pet.vaccinationStatus;
  openModal("petEditModal");
}

function savePetProfile() {
  const id = document.getElementById("petFormId").value;
  const name = document.getElementById("petFormName").value.trim();
  const species = document.getElementById("petFormSpecies").value;
  const breed = document.getElementById("petFormBreed").value.trim();
  const age = document.getElementById("petFormAge").value.trim();
  const weight = document.getElementById("petFormWeight").value.trim();
  const notes = document.getElementById("petFormNotes").value.trim();
  const vaccine = document.getElementById("petFormVaccine").value;

  if (!name || !breed) {
    showToast("Please provide both pet name and breed.", "error");
    return;
  }

  let pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");

  if (id) {
    // Edit existing
    pets = pets.map(p => {
      if (p.id === id) {
        return {
          ...p,
          name, species, breed, age, weight,
          specialNotes: notes,
          vaccinationStatus: vaccine
        };
      }
      return p;
    });
    showToast(`Updated ${name}'s profile successfully!`, "success");
  } else {
    // Add new
    const newPet = {
      id: "pet-" + Date.now().toString().slice(-4),
      name, species, breed, age, weight,
      gender: "Friendly",
      avatar: species === "Cat"
        ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80"
        : "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
      ownerId: "usr-01",
      ownerName: "Sarah Jenkins",
      ownerEmail: "sarah@example.com",
      ownerPhone: "+1 (555) 234-5678",
      vaccinationStatus: vaccine,
      vaccinationExpiry: "2027-04-15",
      specialNotes: notes || "Loves soft toys and praise.",
      emergencyContact: "Sarah Jenkins (555-234-5678)"
    };
    pets.push(newPet);
    showToast(`Registered ${name} to your profile!`, "success");
  }

  localStorage.setItem("paws_pets", JSON.stringify(pets));
  closeModal("petEditModal");
  renderMyPetsList();
  renderUserOverview();
}

function deletePetConfirm(petId) {
  const pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  const pet = pets.find(p => p.id === petId);
  if (!pet) return;

  if (confirm(`Are you sure you want to remove ${pet.name} from your profile?`)) {
    const updated = pets.filter(p => p.id !== petId);
    localStorage.setItem("paws_pets", JSON.stringify(updated));
    showToast(`Removed ${pet.name} from your profile`, "info");
    renderMyPetsList();
    renderUserOverview();
  }
}

function quickBookPet(petId) {
  sessionStorage.setItem("paws_selected_pet", petId);
  window.location.href = "booking.html";
}

// ---------------------------------------------------------------------------
// 4. Stay Tracking Tab
// ---------------------------------------------------------------------------
function renderActiveStayTracker() {
  const container = document.getElementById("userTrackingContainer");
  if (!container) return;

  const stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");
  const stay = stays[0] || {
    id: "STAY-9041",
    petName: "Max",
    breed: "Golden Retriever",
    stageIndex: 3,
    status: "In Care",
    assignedCaretaker: "Jessica Miller",
    latestNote: "Max is having a blast in the afternoon splash pool!"
  };

  const stages = [
    { num: 1, title: "Checked In", desc: "Arrival & VIP welcome", icon: "bi-box-arrow-in-right" },
    { num: 2, title: "Settling In", desc: "Suite unpack & scent familiarization", icon: "bi-house-check" },
    { num: 3, title: "Daily Activities", desc: "Play yards, meals & enrichment", icon: "bi-tree-fill" },
    { num: 4, title: "Health Check", desc: "Coat brush, vitals & refresh", icon: "bi-heart-pulse-fill" },
    { num: 5, title: "Ready for Pickup", desc: "Packed, spritzed & happy reunion", icon: "bi-emoji-smile-fill" }
  ];

  container.innerHTML = `
    <div class="card-paw p-6 sm:p-8 mb-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)] mb-8">
        <div>
          <span class="badge-pet badge-coral text-xs mb-1">Live Progress • ${stay.id}</span>
          <h3 class="text-2xl font-black text-[var(--text-main)]">${stay.petName}'s Journey</h3>
          <p class="text-xs text-[var(--text-muted)]">${stay.serviceName} • Room: ${stay.suite}</p>
        </div>
        <div class="text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)]/60">
          <p class="text-xs text-[var(--text-muted)]">Assigned Caretaker:</p>
          <p class="text-sm font-bold text-[var(--brand-primary)]"><i class="bi bi-person-badge"></i> ${stay.assignedCaretaker}</p>
        </div>
      </div>

      <!-- 5-Stage Stepper -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-0 md:gap-4 mb-10">
        ${stages.map((st, idx) => {
          let stateClass = "";
          let badgeHtml = "";
          if (st.num < stay.stageIndex) {
            stateClass = "completed";
            badgeHtml = `<span class="badge-pet badge-teal text-[9px] py-0.5 px-2 md:hidden">Completed</span>`;
          } else if (st.num === stay.stageIndex) {
            stateClass = "active";
            badgeHtml = `<span class="badge-pet badge-coral text-[9px] py-0.5 px-2 md:hidden animate-pulse">In Progress</span>`;
          } else {
            badgeHtml = `<span class="text-[10px] text-[var(--text-muted)] md:hidden">Upcoming</span>`;
          }
          const isLast = idx === stages.length - 1;
          return `
            <div class="tracker-step ${stateClass} flex md:flex-col items-start md:items-center gap-3.5 md:gap-2 w-full ${isLast ? '' : 'pb-6 md:pb-0'}">
              <div class="tracker-node flex-shrink-0">
                <i class="bi ${st.num < stay.stageIndex ? 'bi-check-lg text-lg' : st.icon}"></i>
              </div>
              <div class="tracker-content flex-1 min-w-0 text-left md:text-center pt-0.5 md:pt-0">
                <div class="flex items-center gap-2 flex-wrap md:justify-center">
                  <h5 class="font-bold text-xs sm:text-sm text-[var(--text-main)]">${st.title}</h5>
                  ${badgeHtml}
                </div>
                <p class="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">${st.desc}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Latest Caretaker Note -->
      <div class="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg flex-shrink-0">
          <i class="bi bi-chat-quote-fill"></i>
        </div>
        <div class="flex-1">
          <h5 class="text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">Latest Caretaker Update</h5>
          <p class="text-sm text-[var(--text-main)] font-medium mt-1">"${stay.latestNote}"</p>
          <p class="text-[11px] text-[var(--text-muted)] mt-1">Logged 25 minutes ago by ${stay.assignedCaretaker}</p>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 5. Daily Activity & Feeding Logs
// ---------------------------------------------------------------------------
function renderDailyLogsList() {
  const container = document.getElementById("userDailyLogsContainer");
  if (!container) return;

  const logs = JSON.parse(localStorage.getItem("paws_dailyLogs") || "[]");
  container.innerHTML = logs.map(log => `
    <div class="flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]/30 transition shadow-sm">
      <div class="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-xl text-[var(--brand-primary)] flex-shrink-0">
        <i class="bi ${log.icon}"></i>
      </div>
      <div class="flex-1">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <div class="flex items-center gap-2">
            <h4 class="font-bold text-sm text-[var(--text-main)]">${log.title}</h4>
            <span class="badge-pet ${log.badgeClass} text-[10px]">${log.type}</span>
          </div>
          <span class="text-xs font-semibold text-[var(--brand-primary)]">${log.time}</span>
        </div>
        <p class="text-xs text-[var(--text-muted)] leading-relaxed">${log.details}</p>
        <p class="text-[10px] text-[var(--text-light)] mt-2 font-medium">Logged by Caretaker ${log.staff}</p>
      </div>
    </div>
  `).join('');
}

// ---------------------------------------------------------------------------
// 6. Health Status Reports
// ---------------------------------------------------------------------------
function renderHealthReports() {
  const container = document.getElementById("userHealthReportsContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-[var(--text-muted)] uppercase">Current Weight</span>
          <i class="bi bi-speedometer2 text-emerald-600 text-lg"></i>
        </div>
        <div class="text-3xl font-black text-[var(--text-main)]">68.2 <span class="text-sm font-normal text-[var(--text-muted)]">lbs</span></div>
        <p class="text-xs text-emerald-600 font-semibold mt-2"><i class="bi bi-arrow-up-right"></i> Stable & Healthy BMI</p>
      </div>

      <div class="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-[var(--text-muted)] uppercase">Body Temperature</span>
          <i class="bi bi-thermometer-half text-amber-500 text-lg"></i>
        </div>
        <div class="text-3xl font-black text-[var(--text-main)]">101.4 <span class="text-sm font-normal text-[var(--text-muted)]">°F</span></div>
        <p class="text-xs text-emerald-600 font-semibold mt-2"><i class="bi bi-check-circle"></i> Optimal canine vitals</p>
      </div>

      <div class="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-[var(--text-muted)] uppercase">Hydration Level</span>
          <i class="bi bi-droplet-fill text-sky-500 text-lg"></i>
        </div>
        <div class="text-3xl font-black text-[var(--text-main)]">100% <span class="text-sm font-normal text-[var(--text-muted)]">Hydrated</span></div>
        <p class="text-xs text-emerald-600 font-semibold mt-2"><i class="bi bi-check-all"></i> Fresh spring water bowl</p>
      </div>
    </div>

    <!-- Medication Admin Table -->
    <div class="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
      <h4 class="font-bold text-base text-[var(--text-main)] mb-4">Medication & Treatment Administration Log</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-[var(--border-color)] text-[var(--text-muted)]">
              <th class="pb-3">Date & Time</th>
              <th class="pb-3">Medication / Treatment</th>
              <th class="pb-3">Dosage</th>
              <th class="pb-3">Status</th>
              <th class="pb-3">Administered By</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--border-color)] text-[var(--text-main)]">
            <tr>
              <td class="py-3 font-semibold">Today, 08:00 AM</td>
              <td class="py-3">Glucosamine Joint Supplement Chew</td>
              <td class="py-3">1 tablet with breakfast</td>
              <td class="py-3"><span class="badge-pet badge-teal text-[10px]">Completed</span></td>
              <td class="py-3 font-medium">Jessica Miller (Vet Tech)</td>
            </tr>
            <tr>
              <td class="py-3 font-semibold">Yesterday, 08:00 AM</td>
              <td class="py-3">Glucosamine Joint Supplement Chew</td>
              <td class="py-3">1 tablet with breakfast</td>
              <td class="py-3"><span class="badge-pet badge-teal text-[10px]">Completed</span></td>
              <td class="py-3 font-medium">Jessica Miller (Vet Tech)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 7. Photo & Video Feed Tab
// ---------------------------------------------------------------------------
function renderUserPhotos() {
  const container = document.getElementById("userPhotosGrid");
  if (!container) return;

  const photos = JSON.parse(localStorage.getItem("paws_photoFeed") || "[]");
  container.innerHTML = photos.map(photo => `
    <div class="gallery-item group relative rounded-3xl overflow-hidden shadow-sm border border-[var(--border-color)] aspect-square cursor-pointer bg-[var(--bg-subtle)]" onclick="openLightbox('${photo.url}', '${photo.title} - ${photo.caption}')">
      <img src="${photo.url}" alt="${photo.title}" class="gallery-grid-img w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
        <span class="badge-pet bg-white/20 text-white text-[10px] w-max mb-1">${photo.category}</span>
        <h5 class="font-bold text-base leading-tight">${photo.title}</h5>
        <p class="text-xs text-white/80 line-clamp-2 mt-1">${photo.caption}</p>
        <span class="text-[10px] text-white/60 mt-2"><i class="bi bi-clock"></i> ${photo.date}</span>
      </div>
    </div>
  `).join('');
}

// ---------------------------------------------------------------------------
// 8. Payment & Invoices Tab
// ---------------------------------------------------------------------------
function renderInvoicesTable() {
  const container = document.getElementById("userInvoicesTableBody");
  if (!container) return;

  const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
  container.innerHTML = invoices.map(inv => `
    <tr class="hover:bg-[var(--bg-subtle)] transition">
      <td class="py-4 px-4 font-bold text-[var(--brand-primary)]">${inv.id}</td>
      <td class="py-4 px-4 font-semibold text-[var(--text-main)]">${inv.petName}</td>
      <td class="py-4 px-4 text-[var(--text-muted)]">${inv.service}</td>
      <td class="py-4 px-4 text-[var(--text-muted)]">${inv.date}</td>
      <td class="py-4 px-4 font-bold text-[var(--text-main)]">$${inv.total.toFixed(2)}</td>
      <td class="py-4 px-4">
        <span class="badge-pet badge-teal text-[10px]">${inv.status}</span>
      </td>
      <td class="py-4 px-4 text-right">
        <div class="inline-flex items-center gap-1.5">
          <button type="button" onclick="viewInvoiceModal('${inv.id}')" class="btn-brand-outline py-1.5 px-2.5 text-xs rounded-lg flex items-center gap-1 shadow-xs" title="View complete invoice">
            <i class="bi bi-eye"></i> View
          </button>
          <button type="button" onclick="printInvoiceDirect('${inv.id}')" class="btn-brand-primary py-1.5 px-2.5 text-xs rounded-lg flex items-center gap-1 shadow-xs" title="Print full invoice or save as PDF">
            <i class="bi bi-printer-fill"></i> PDF
          </button>
          <button type="button" onclick="downloadInvoiceHtml('${inv.id}')" class="btn-brand-outline py-1.5 px-2 text-xs rounded-lg flex items-center shadow-xs" title="Download complete HTML invoice file">
            <i class="bi bi-download"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

let currentViewedInvoiceId = null;

function getInvoiceCardMarkup(inv) {
  return `
    <div id="printable-invoice" class="p-6 sm:p-8 bg-white dark:bg-[var(--bg-surface)] text-gray-900 dark:text-[var(--text-main)] rounded-3xl border border-gray-200 dark:border-[var(--border-color)] shadow-sm space-y-6">
      <!-- Invoice Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-[var(--border-color)] gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-[#F0F1EC] flex items-center justify-center shadow-sm overflow-hidden border border-gray-200 dark:border-[var(--border-color)] flex-shrink-0">
            <img src="images/logo.png" alt="PawsHaven Logo" class="w-full h-full object-cover block">
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-[var(--brand-primary)] dark:text-emerald-400 leading-tight">PawsHaven Resort & Daycare</h2>
            <p class="text-xs text-gray-500 dark:text-[var(--text-muted)] mt-0.5">Licensed & Insured Luxury Pet Care Facility</p>
          </div>
        </div>
        <div class="sm:text-right">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-1">
            <i class="bi bi-check-circle-fill"></i> ${inv.status || 'Paid'}
          </span>
          <p class="text-xs text-gray-400 dark:text-[var(--text-muted)]">Invoice Number</p>
          <p class="text-lg font-black text-gray-800 dark:text-[var(--text-main)] font-mono">${inv.id}</p>
        </div>
      </div>

      <!-- Meta Details Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <!-- Billed To -->
        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-[var(--bg-subtle)] border border-gray-100 dark:border-[var(--border-color)]">
          <p class="font-bold text-[10px] uppercase tracking-wider text-[var(--brand-primary)] dark:text-emerald-400 mb-1.5">Billed To (Pet Parent)</p>
          <p class="text-sm font-extrabold text-gray-900 dark:text-[var(--text-main)]">${inv.customerName}</p>
          <p class="text-gray-600 dark:text-[var(--text-muted)] truncate">${inv.customerEmail}</p>
          <p class="text-gray-600 dark:text-[var(--text-muted)] mt-1">Pet Guest: <strong class="text-gray-900 dark:text-[var(--text-main)]">${inv.petName}</strong></p>
        </div>

        <!-- Booking & Date Info -->
        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-[var(--bg-subtle)] border border-gray-100 dark:border-[var(--border-color)]">
          <p class="font-bold text-[10px] uppercase tracking-wider text-[var(--brand-primary)] dark:text-emerald-400 mb-1.5">Stay Confirmation</p>
          <p class="text-xs text-gray-700 dark:text-[var(--text-main)]">Booking Ref: <strong class="font-mono text-gray-900 dark:text-[var(--text-main)]">${inv.bookingId || 'STAY-9041'}</strong></p>
          <p class="text-xs text-gray-700 dark:text-[var(--text-main)] mt-0.5">Date of Issue: <strong>${inv.date}</strong></p>
          <p class="text-xs text-gray-700 dark:text-[var(--text-main)] mt-0.5">Payment Method: <strong>${inv.paymentMethod}</strong></p>
        </div>

        <!-- Facility Location -->
        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-[var(--bg-subtle)] border border-gray-100 dark:border-[var(--border-color)]">
          <p class="font-bold text-[10px] uppercase tracking-wider text-[var(--brand-primary)] dark:text-emerald-400 mb-1.5">Resort Location</p>
          <p class="font-bold text-gray-900 dark:text-[var(--text-main)]">PawsHaven Resort</p>
          <p class="text-gray-600 dark:text-[var(--text-muted)]">4820 Paws Meadow Blvd</p>
          <p class="text-gray-600 dark:text-[var(--text-muted)]">Austin, TX 78704 • (555) 729-7428</p>
        </div>
      </div>

      <!-- Full Itemized Table -->
      <div class="border border-gray-200 dark:border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs">
        <table class="w-full text-xs text-left">
          <thead class="bg-gray-100 dark:bg-[var(--bg-subtle)] text-gray-800 dark:text-[var(--text-main)] font-black uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-[var(--border-color)]">
            <tr>
              <th class="p-3.5">Line Item / Service Description</th>
              <th class="p-3.5 text-center">Status</th>
              <th class="p-3.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-[var(--border-color)] text-gray-800 dark:text-[var(--text-main)]">
            <tr>
              <td class="p-3.5">
                <span class="font-bold block text-sm">${inv.service}</span>
                <span class="text-[11px] text-gray-500 dark:text-[var(--text-muted)]">Includes 24/7 web-cam access, private climate-controlled suite & playtime</span>
              </td>
              <td class="p-3.5 text-center font-semibold text-emerald-600">Delivered</td>
              <td class="p-3.5 text-right font-black text-sm">$${inv.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="p-3.5">
                <span class="font-medium block">Daily Nutritional Feeding & Dietary Care</span>
                <span class="text-[11px] text-gray-500 dark:text-[var(--text-muted)]">Chef-formulated meals with fresh water refresh</span>
              </td>
              <td class="p-3.5 text-center font-semibold text-emerald-600">Included</td>
              <td class="p-3.5 text-right font-semibold text-gray-500">$0.00</td>
            </tr>
            <tr>
              <td class="p-3.5">
                <span class="font-medium block">Daily Play Yard & Agility Park Sessions</span>
                <span class="text-[11px] text-gray-500 dark:text-[var(--text-muted)]">Supervised group activity & personal cuddle time</span>
              </td>
              <td class="p-3.5 text-center font-semibold text-emerald-600">Included</td>
              <td class="p-3.5 text-right font-semibold text-gray-500">$0.00</td>
            </tr>
            <tr class="bg-gray-50/70 dark:bg-[var(--bg-subtle)]/50">
              <td colspan="2" class="p-3 text-right font-bold text-gray-600 dark:text-[var(--text-muted)]">Subtotal</td>
              <td class="p-3 text-right font-bold">$${inv.subtotal.toFixed(2)}</td>
            </tr>
            <tr class="bg-gray-50/70 dark:bg-[var(--bg-subtle)]/50">
              <td colspan="2" class="p-3 text-right font-bold text-gray-600 dark:text-[var(--text-muted)]">State & Resort Environmental Tax (8%)</td>
              <td class="p-3 text-right font-bold text-gray-700 dark:text-[var(--text-main)]">$${inv.tax.toFixed(2)}</td>
            </tr>
            <tr class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-black text-base border-t-2 border-emerald-500">
              <td colspan="2" class="p-4 text-right">Total Amount Paid (${inv.paymentMethod})</td>
              <td class="p-4 text-right text-lg font-black text-emerald-700 dark:text-emerald-300">$${inv.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Official Seal & Thank You Footer -->
      <div class="pt-4 border-t border-gray-200 dark:border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-[var(--text-muted)]">
        <div>
          <p class="font-bold text-gray-700 dark:text-[var(--text-main)]">Verified Official Digital Receipt</p>
          <p class="text-[11px]">Thank you for entrusting PawsHaven with ${inv.petName}'s happiness & care!</p>
        </div>
        <div class="text-[10px] font-mono text-right opacity-80">
          Auth Ref: #TX-${inv.id.replace('INV-', '')}-PAID
        </div>
      </div>
    </div>
  `;
}

function getStandaloneInvoicePageHTML(inv, isAutoPrint = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Invoice ${inv.id} - PawsHaven Resort</title>
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
      .invoice-container {
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
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
      gap: 16px;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 48px;
      height: 48px;
      background: #1B4D3E;
      color: #ffffff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
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
      margin-top: 2px;
    }
    .badge-paid {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .inv-number {
      font-size: 17px;
      font-weight: 800;
      color: #111827;
      font-family: monospace;
      margin-top: 3px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 20px;
    }
    .meta-card {
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
      margin-bottom: 4px;
    }
    .meta-strong {
      font-weight: 700;
      color: #111827;
    }
    .meta-text {
      color: #4b5563;
      margin-top: 2px;
      font-size: 11px;
    }
    .table-box {
      margin-top: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      text-align: left;
    }
    th {
      background: #f3f4f6;
      color: #111827;
      font-weight: 800;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 10px 14px;
      border-bottom: 1px solid #e5e7eb;
    }
    td {
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
      font-size: 15px;
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
      font-size: 10px;
      font-weight: 700;
      color: #4b5563;
    }
    @media (max-width: 640px) {
      .meta-grid {
        grid-template-columns: 1fr;
      }
      .header-row {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>
<body>
  ${!isAutoPrint ? `
  <div class="top-actions no-print">
    <div style="font-size: 12px; color: #4b5563; font-weight: 600;">
      <i class="bi bi-shield-check text-emerald-600"></i> Official PawsHaven Record
    </div>
    <div style="display:flex; gap:8px;">
      <button class="btn-action" onclick="window.print()">
        <i class="bi bi-printer-fill"></i> Print / Save as PDF
      </button>
    </div>
  </div>` : ''}

  <div class="invoice-container">
    <!-- Header -->
    <div class="header-row">
      <div class="brand-group">
        <div class="brand-icon" style="width:40px;height:40px;overflow:hidden;border-radius:10px;border:1px solid #e5e7eb;background:#F0F1EC;display:flex;align-items:center;justify-content:center;">
          <img src="images/logo.png" alt="PawsHaven Logo" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <div>
          <h1 class="brand-title">PawsHaven Resort & Daycare</h1>
          <p class="brand-sub">Licensed & Insured Luxury Pet Care Facility</p>
        </div>
      </div>
      <div style="text-align: right;">
        <span class="badge-paid">
          <i class="bi bi-check-circle-fill"></i> ${inv.status || 'Paid'}
        </span>
        <div class="inv-number">${inv.id}</div>
      </div>
    </div>

    <!-- Meta Details Grid -->
    <div class="meta-grid">
      <div class="meta-card">
        <div class="meta-label">Billed To (Pet Parent)</div>
        <div class="meta-strong">${inv.customerName}</div>
        <div class="meta-text">${inv.customerEmail}</div>
        <div class="meta-text" style="margin-top: 4px;">Pet Guest: <strong>${inv.petName}</strong></div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Stay Confirmation</div>
        <div class="meta-text">Booking Ref: <strong style="font-family:monospace;">${inv.bookingId || 'STAY-9041'}</strong></div>
        <div class="meta-text">Issue Date: <strong>${inv.date}</strong></div>
        <div class="meta-text">Payment: <strong>${inv.paymentMethod}</strong></div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Resort Location</div>
        <div class="meta-strong">PawsHaven Resort</div>
        <div class="meta-text">4820 Paws Meadow Blvd</div>
        <div class="meta-text">Austin, TX 78704 • (555) 729-7428</div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-box">
      <table>
        <thead>
          <tr>
            <th>Line Item / Service Description</th>
            <th style="text-align:center;">Status</th>
            <th style="text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong style="font-size:13px;">${inv.service}</strong><br>
              <span style="font-size:11px; color:#6b7280;">Includes 24/7 web-cam access, private climate-controlled suite & daily playtime</span>
            </td>
            <td style="text-align:center; color:#059669; font-weight:600;">Delivered</td>
            <td style="text-align:right; font-weight:800; font-size:13px;">$${inv.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>
              <strong>Daily Nutritional Feeding & Dietary Care</strong><br>
              <span style="font-size:11px; color:#6b7280;">Chef-formulated meals with continuous fresh water refresh</span>
            </td>
            <td style="text-align:center; color:#059669; font-weight:600;">Included</td>
            <td style="text-align:right; color:#6b7280; font-weight:600;">$0.00</td>
          </tr>
          <tr>
            <td>
              <strong>Daily Play Yard & Agility Park Sessions</strong><br>
              <span style="font-size:11px; color:#6b7280;">Supervised group activity & personalized cuddle sessions</span>
            </td>
            <td style="text-align:center; color:#059669; font-weight:600;">Included</td>
            <td style="text-align:right; color:#6b7280; font-weight:600;">$0.00</td>
          </tr>
          <tr class="subtotal-row">
            <td colspan="2" style="text-align:right; color:#4b5563;">Subtotal</td>
            <td style="text-align:right; font-weight:700;">$${inv.subtotal.toFixed(2)}</td>
          </tr>
          <tr class="subtotal-row">
            <td colspan="2" style="text-align:right; color:#4b5563;">State & Resort Environmental Tax (8%)</td>
            <td style="text-align:right; font-weight:700;">$${inv.tax.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="2" style="text-align:right; padding:14px;">Total Amount Paid (${inv.paymentMethod})</td>
            <td style="text-align:right; padding:14px; font-size:17px;">$${inv.total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Official Seal -->
    <div class="footer-seal">
      <div>
        <div style="font-weight:700; color:#111827;">Verified Official Digital Receipt</div>
        <div style="font-size:10px;">Thank you for entrusting PawsHaven with ${inv.petName}'s happiness & care!</div>
      </div>
      <div class="auth-ref">
        AUTH REF: #TX-${inv.id.replace('INV-', '')}-PAID
      </div>
    </div>
  </div>
</body>
</html>`;
}

function viewInvoiceModal(invoiceId) {
  const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
  const inv = invoices.find(i => i.id === invoiceId) || invoices[0];
  if (!inv) return;
  currentViewedInvoiceId = inv.id;

  const content = document.getElementById("invoiceModalContent");
  if (content) {
    content.innerHTML = getInvoiceCardMarkup(inv);
    openModal("invoiceViewModal");
  }
}

function printInvoiceDirect(invoiceId) {
  const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
  const inv = invoices.find(i => i.id === invoiceId) || invoices[0];
  if (!inv) return;

  const fullHtml = getStandaloneInvoicePageHTML(inv, true);

  // Hidden iframe guarantees zero parent flex or overflow cutoff
  let frame = document.getElementById("paws-print-iframe");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "paws-print-iframe";
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

  // Allow styles to settle before invoking browser print dialog
  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }, 250);
}

function printCurrentInvoice() {
  if (!currentViewedInvoiceId) {
    const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
    currentViewedInvoiceId = invoices.length > 0 ? invoices[0].id : "INV-2026-9041";
  }
  printInvoiceDirect(currentViewedInvoiceId);
}

function openInvoiceInNewTab(invoiceId) {
  const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
  const inv = invoices.find(i => i.id === invoiceId) || invoices[0];
  if (!inv) return;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(getStandaloneInvoicePageHTML(inv, false));
    win.document.close();
  } else {
    // Fallback if popup blocker is active
    viewInvoiceModal(inv.id);
  }
}

function openCurrentInvoiceInNewTab() {
  if (!currentViewedInvoiceId) {
    const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
    currentViewedInvoiceId = invoices.length > 0 ? invoices[0].id : "INV-2026-9041";
  }
  openInvoiceInNewTab(currentViewedInvoiceId);
}

function downloadInvoiceHtml(invoiceId) {
  const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
  const inv = invoices.find(i => i.id === invoiceId) || invoices[0];
  if (!inv) return;

  const htmlContent = getStandaloneInvoicePageHTML(inv, false);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${inv.id}-${inv.petName}-invoice.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (typeof showToast === "function") {
    showToast(`Downloaded complete invoice ${inv.id} for ${inv.petName}`, "success");
  }
}

function downloadCurrentInvoiceHtml() {
  if (!currentViewedInvoiceId) {
    const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
    currentViewedInvoiceId = invoices.length > 0 ? invoices[0].id : "INV-2026-9041";
  }
  downloadInvoiceHtml(currentViewedInvoiceId);
}

function downloadInvoiceTxt(invoiceId) {
  const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
  const inv = invoices.find(i => i.id === invoiceId) || invoices[0];
  if (!inv) return;

  const content = `===============================================================
                 PAWSHAVEN RESORT & DAYCARE
               OFFICIAL STAY RECEIPT & INVOICE
===============================================================
Invoice Number  : ${inv.id}
Booking Ref     : ${inv.bookingId || 'STAY-9041'}
Date Issued     : ${inv.date}
Payment Status  : PAID IN FULL
Payment Method  : ${inv.paymentMethod}
Authorization   : TX-${inv.id.replace('INV-', '')}-VERIFIED
---------------------------------------------------------------
PET PARENT (BILLED TO):
Name            : ${inv.customerName}
Email           : ${inv.customerEmail}
Pet Guest       : ${inv.petName}

FACILITY LOCATION:
PawsHaven Luxury Pet Resort
4820 Paws Meadow Blvd, Austin, TX 78704
Phone           : (555) 729-7428
Email           : concierge@pawshavenresort.com
---------------------------------------------------------------
ITEMIZED STAY SERVICES:
1. ${inv.service.padEnd(42)} : $${inv.subtotal.toFixed(2)}
2. Daily Chef Nutrition & Fresh Water Refresh : INCLUDED ($0.00)
3. 24/7 Supervised Playcare & Agility Access  : INCLUDED ($0.00)
4. HD Live Webcam & Daily Digital Report Card : INCLUDED ($0.00)
---------------------------------------------------------------
Subtotal                                      : $${inv.subtotal.toFixed(2)}
State & Resort Environmental Tax (8%)         : $${inv.tax.toFixed(2)}
---------------------------------------------------------------
TOTAL PAID                                    : $${inv.total.toFixed(2)}
===============================================================
Thank you for trusting PawsHaven Resort with ${inv.petName}'s stay!
Licensed, Bonded, and Verified Pet Care Excellence.
===============================================================`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${inv.id}-${inv.petName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (typeof showToast === "function") {
    showToast(`Downloaded text receipt ${inv.id} for ${inv.petName}`, "success");
  }
}

function downloadCurrentInvoiceTxt() {
  if (!currentViewedInvoiceId) {
    const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");
    currentViewedInvoiceId = invoices.length > 0 ? invoices[0].id : "INV-2026-9041";
  }
  downloadInvoiceTxt(currentViewedInvoiceId);
}

// Backward compatibility
function downloadCurrentInvoiceFile() {
  downloadCurrentInvoiceTxt();
}

window.renderInvoicesTable = renderInvoicesTable;
window.viewInvoiceModal = viewInvoiceModal;
window.printInvoiceDirect = printInvoiceDirect;
window.printCurrentInvoice = printCurrentInvoice;
window.openInvoiceInNewTab = openInvoiceInNewTab;
window.openCurrentInvoiceInNewTab = openCurrentInvoiceInNewTab;
window.downloadInvoiceHtml = downloadInvoiceHtml;
window.downloadCurrentInvoiceHtml = downloadCurrentInvoiceHtml;
window.downloadInvoiceTxt = downloadInvoiceTxt;
window.downloadCurrentInvoiceTxt = downloadCurrentInvoiceTxt;
window.downloadCurrentInvoiceFile = downloadCurrentInvoiceFile;

// ---------------------------------------------------------------------------
// 8. Vaccine & Health Reminders Section
// ---------------------------------------------------------------------------
let currentReminderFilter = "all";

function getSavedReminders() {
  const defaultReminders = [
    { id: "rem-1", pet: "Max", type: "Bordetella (Kennel Cough)", dueDate: "2026-09-21", daysLeft: 13, clinic: "Dr. Marcus Vance (Resort Clinic)", certId: "CERT-BOR-9921", status: "Due Soon", badgeClass: "badge-amber", icon: "bi-shield-exclamation" },
    { id: "rem-2", pet: "Max", type: "Flea & Tick Preventative", dueDate: "2026-09-13", daysLeft: 5, clinic: "Austin Pet Care", certId: "RX-FLEA-4412", status: "Due Soon", badgeClass: "badge-coral", icon: "bi-bug-fill" },
    { id: "rem-3", pet: "Max", type: "Full Grooming & Pawdicure", dueDate: "2026-09-16", daysLeft: 8, clinic: "PawsHaven Spa", certId: "APPT-GRM-02", status: "Due Soon", badgeClass: "badge-teal", icon: "bi-scissors" },
    { id: "rem-4", pet: "Max", type: "DHPP Core Vaccine", dueDate: "2026-10-22", daysLeft: 44, clinic: "Dr. Marcus Vance", certId: "CERT-DHPP-882", status: "Valid", badgeClass: "badge-teal", icon: "bi-shield-check" },
    { id: "rem-5", pet: "Max", type: "Rabies Vaccine", dueDate: "2027-03-10", daysLeft: 183, clinic: "Austin City Vet", certId: "RAB-TAG-2027", status: "Valid", badgeClass: "badge-teal", icon: "bi-patch-check-fill" },
    { id: "rem-6", pet: "Bella", type: "Eye Medication Refill", dueDate: "2026-09-11", daysLeft: 3, clinic: "Resort Wellness", certId: "RX-MED-102", status: "Due Soon", badgeClass: "badge-coral", icon: "bi-capsule" }
  ];

  const saved = localStorage.getItem("paws_reminders");
  if (!saved) {
    localStorage.setItem("paws_reminders", JSON.stringify(defaultReminders));
    return defaultReminders;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return defaultReminders;
  }
}

function renderUserReminders() {
  const container = document.getElementById("userRemindersGrid");
  if (!container) return;

  const reminders = getSavedReminders();
  
  let list = reminders;
  if (currentReminderFilter === "due") {
    list = reminders.filter(r => r.daysLeft <= 14);
  } else if (currentReminderFilter === "valid") {
    list = reminders.filter(r => r.daysLeft > 14);
  }

  if (!list.length) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-color)]">
        <div class="w-14 h-14 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center text-xl text-[var(--text-muted)] mx-auto mb-3">
          <i class="bi bi-bell-slash"></i>
        </div>
        <h4 class="font-bold text-base text-[var(--text-main)]">No Reminders Found</h4>
        <p class="text-xs text-[var(--text-muted)] mt-1 mb-4">All preventative health records in this filter category are clear!</p>
        <button onclick="openAddReminderModal()" class="btn-brand-accent text-xs py-2 px-4 rounded-xl">
          <i class="bi bi-plus-circle-fill"></i> Log New Record
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(rem => {
    const isDue = rem.daysLeft <= 14;
    return `
      <div class="card-paw p-5 flex flex-col justify-between hover:shadow-lg transition">
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl ${isDue ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40'} flex items-center justify-center text-lg shadow-sm">
                <i class="bi ${rem.icon || 'bi-shield-check'}"></i>
              </div>
              <div>
                <h4 class="font-bold text-sm text-[var(--text-main)]">${rem.type}</h4>
                <span class="text-[11px] text-[var(--text-muted)]">Pet: <strong class="text-[var(--text-main)]">${rem.pet}</strong></span>
              </div>
            </div>
            <span class="badge-pet ${rem.badgeClass || (isDue ? 'badge-amber' : 'badge-teal')} text-[10px]">
              ${isDue ? `Due in ${rem.daysLeft}d` : 'Valid'}
            </span>
          </div>

          <div class="space-y-1.5 py-3 border-y border-[var(--border-color)] text-xs text-[var(--text-muted)]">
            <div class="flex items-center justify-between">
              <span>Target Due Date:</span>
              <span class="font-bold text-[var(--text-main)]">${rem.dueDate}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Clinic / Vet:</span>
              <span class="font-medium text-[var(--text-main)] truncate max-w-[140px]">${rem.clinic || 'Resort Clinic'}</span>
            </div>
            ${rem.certId ? `
            <div class="flex items-center justify-between">
              <span>Certificate ID:</span>
              <span class="font-mono text-[11px] text-[var(--brand-primary)] dark:text-emerald-400">${rem.certId}</span>
            </div>` : ''}
          </div>
        </div>

        <div class="pt-3 mt-3 flex items-center gap-2 border-t border-[var(--border-color)]">
          <button onclick="markReminderDone('${rem.id}')" class="btn-brand-primary text-xs py-2 px-3 rounded-xl flex-1 flex items-center justify-center gap-1.5 font-bold">
            <i class="bi bi-check2-circle"></i> Mark Renewed
          </button>
          <button onclick="deleteUserReminder('${rem.id}')" class="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs transition" title="Delete record">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterUserReminders(filterType) {
  currentReminderFilter = filterType;
  document.querySelectorAll(".rem-filter-btn").forEach(btn => {
    if (btn.dataset.filter === filterType) {
      btn.className = "rem-filter-btn px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-white shadow-sm font-bold";
    } else {
      btn.className = "rem-filter-btn px-4 py-2 rounded-xl hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] font-bold";
    }
  });
  renderUserReminders();
}

function openAddReminderModal() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  const dueInput = document.getElementById("remDueDate");
  if (dueInput) dueInput.value = d.toISOString().split("T")[0];
  openModal("addReminderModal");
}

function saveNewReminder() {
  const pet = document.getElementById("remPetSelect").value;
  const type = document.getElementById("remTypeSelect").value;
  const dueDate = document.getElementById("remDueDate").value;
  const clinic = document.getElementById("remClinic").value.trim() || "Resort Clinic";
  const certId = document.getElementById("remCertId").value.trim();

  if (!pet || !type || !dueDate) {
    showToast("Please fill in required reminder fields.", "error");
    return;
  }

  // Calculate days left
  const diffDays = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, diffDays);

  const newRem = {
    id: "rem-" + Date.now().toString().slice(-4),
    pet,
    type,
    dueDate,
    daysLeft,
    clinic,
    certId,
    status: daysLeft <= 14 ? "Due Soon" : "Valid",
    badgeClass: daysLeft <= 14 ? "badge-amber" : "badge-teal",
    icon: type.includes("Vaccine") || type.includes("Bordetella") || type.includes("Rabies") ? "bi-patch-check-fill" : (type.includes("Flea") ? "bi-bug-fill" : "bi-bell-fill")
  };

  let reminders = getSavedReminders();
  reminders.unshift(newRem);
  localStorage.setItem("paws_reminders", JSON.stringify(reminders));

  closeModal("addReminderModal");
  document.getElementById("newReminderForm")?.reset();
  showToast(`Recorded ${type} for ${pet}!`, "success");

  renderUserReminders();
  renderUserOverview();
}

function markReminderDone(remId) {
  let reminders = getSavedReminders();
  reminders = reminders.map(r => {
    if (r.id === remId) {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      return {
        ...r,
        dueDate: nextYear.toISOString().split("T")[0],
        daysLeft: 365,
        status: "Valid",
        badgeClass: "badge-teal"
      };
    }
    return r;
  });
  localStorage.setItem("paws_reminders", JSON.stringify(reminders));
  showToast("Record successfully marked renewed for 1 year!", "success");
  renderUserReminders();
  renderUserOverview();
}

function deleteUserReminder(remId) {
  let reminders = getSavedReminders();
  reminders = reminders.filter(r => r.id !== remId);
  localStorage.setItem("paws_reminders", JSON.stringify(reminders));
  showToast("Reminder removed.", "info");
  renderUserReminders();
  renderUserOverview();
}

