/**
 * PawsHaven - Staff Admin Dashboard Controller (admin.html)
 * Handles Admin KPI stats, booking status workflow, caretaker assignment,
 * daily logs posting, pet owner management, and resort operations.
 */

document.addEventListener("DOMContentLoaded", () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  const hash = window.location.hash.replace("#", "") || "overview";
  showAdminSection(hash);

  renderAdminKPIs();
  renderAdminBookingsTable();
  renderAdminOwnersTable();
  renderAdminPetsTable();
  renderAdminStaffTable();
}

// ---------------------------------------------------------------------------
// 1. Navigation & Section Switching
// ---------------------------------------------------------------------------
function showAdminSection(sectionId) {
  document.querySelectorAll(".admin-section").forEach(sec => sec.classList.add("hidden"));

  const target = document.getElementById(`sec-${sectionId}`);
  if (target) {
    target.classList.remove("hidden");
  } else {
    document.getElementById("sec-overview")?.classList.remove("hidden");
  }

  // Update navigation items
  document.querySelectorAll(".admin-nav-item").forEach(item => {
    if (item.dataset.section === sectionId) {
      item.className = "admin-nav-item flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--brand-primary)] text-white font-bold transition shadow-sm";
    } else {
      item.className = "admin-nav-item flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold transition";
    }
  });

  // Mobile sidebar close
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("adminOverlay");
  if (sidebar && overlay && !overlay.classList.contains("hidden")) {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------------------------------------------------------------------------
// 2. Overview KPI Metrics & Summary
// ---------------------------------------------------------------------------
function renderAdminKPIs() {
  const stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");
  const pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  const users = JSON.parse(localStorage.getItem("paws_users") || "[]");
  const invoices = JSON.parse(localStorage.getItem("paws_invoices") || "[]");

  const totalRev = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
  const activeBoarders = stays.filter(s => s.status === "In Care" || s.status === "Checked In" || s.status === "Health Check").length;
  const completedStays = stays.filter(s => s.status === "Completed").length;

  document.getElementById("kpiTotalOwners").textContent = users.length;
  document.getElementById("kpiTotalPets").textContent = pets.length;
  document.getElementById("kpiActiveBoarders").textContent = activeBoarders;
  document.getElementById("kpiCompletedStays").textContent = completedStays;
  document.getElementById("kpiTotalRevenue").textContent = `$${totalRev.toFixed(0)}`;
  document.getElementById("kpiPendingPayments").textContent = "$0.00";
}

// ---------------------------------------------------------------------------
// 3. Bookings Management (Filter, Status Workflow, Caretaker Assign)
// ---------------------------------------------------------------------------
function renderAdminBookingsTable(filterStatus = "all", searchQuery = "") {
  const tbody = document.getElementById("adminBookingsTbody");
  if (!tbody) return;

  let stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");

  if (filterStatus !== "all") {
    stays = stays.filter(s => s.status.toLowerCase() === filterStatus.toLowerCase());
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    stays = stays.filter(s => 
      s.petName.toLowerCase().includes(q) || 
      s.id.toLowerCase().includes(q) || 
      s.ownerName.toLowerCase().includes(q)
    );
  }

  if (!stays.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-8 text-[var(--text-muted)] text-sm">
          No bookings found matching current filters.
        </td>
      </tr>
    `;
    return;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Care": return `<span class="badge-pet badge-coral text-[10px]"><i class="bi bi-heart-pulse"></i> In Care</span>`;
      case "Ready for Pickup": return `<span class="badge-pet badge-amber text-[10px]"><i class="bi bi-bell-fill"></i> Ready</span>`;
      case "Completed": return `<span class="badge-pet badge-teal text-[10px]"><i class="bi bi-check-all"></i> Completed</span>`;
      case "Confirmed": return `<span class="badge-pet badge-teal text-[10px]"><i class="bi bi-check-circle"></i> Confirmed</span>`;
      case "Health Check": return `<span class="badge-pet badge-purple text-[10px]"><i class="bi bi-thermometer"></i> Health Check</span>`;
      default: return `<span class="badge-pet badge-gray text-[10px]">${status}</span>`;
    }
  };

  tbody.innerHTML = stays.map(s => `
    <tr class="hover:bg-[var(--bg-subtle)] transition border-b border-[var(--border-color)]">
      <td class="py-4 px-4 font-bold text-xs text-[var(--brand-primary)]">${s.id}</td>
      <td class="py-4 px-4">
        <div class="flex items-center gap-3">
          <img src="${s.petPhoto}" alt="${s.petName}" class="w-10 h-10 rounded-xl object-cover border border-black/10">
          <div>
            <span class="font-bold text-xs text-[var(--text-main)] block">${s.petName}</span>
            <span class="text-[11px] text-[var(--text-muted)]">${s.breed}</span>
          </div>
        </div>
      </td>
      <td class="py-4 px-4">
        <span class="text-xs font-semibold text-[var(--text-main)] block">${s.ownerName}</span>
        <span class="text-[11px] text-[var(--text-muted)]">${s.ownerPhone}</span>
      </td>
      <td class="py-4 px-4">
        <span class="text-xs font-medium text-[var(--text-main)] block">${s.serviceName}</span>
        <span class="text-[11px] text-[var(--text-muted)]">${s.suite}</span>
      </td>
      <td class="py-4 px-4">
        <div class="text-[11px] text-[var(--text-muted)]">
          <div>In: <strong class="text-[var(--text-main)]">${s.checkInDate}</strong></div>
          <div>Out: <strong class="text-[var(--text-main)]">${s.checkOutDate}</strong></div>
        </div>
      </td>
      <td class="py-4 px-4">
        ${getStatusBadge(s.status)}
        <div class="text-[10px] text-[var(--text-muted)] mt-1 truncate max-w-[120px]" title="${s.assignedCaretaker}">
          <i class="bi bi-person"></i> ${s.assignedCaretaker.split(' ')[0]}
        </div>
      </td>
      <td class="py-4 px-4 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button onclick="openStatusUpdateModal('${s.id}')" class="btn-brand-primary text-[11px] py-1 px-2.5 rounded-lg" title="Advance Stay Stage">
            <i class="bi bi-arrow-repeat"></i> Status
          </button>
          <button onclick="openAssignCaretakerModal('${s.id}')" class="btn-brand-outline text-[11px] py-1 px-2.5 rounded-lg" title="Assign Caretaker">
            <i class="bi bi-person-gear"></i> Staff
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterBookingsByStatus(status) {
  renderAdminBookingsTable(status);
}

function searchBookings(query) {
  renderAdminBookingsTable("all", query);
}

// Status update modal & workflow
function openStatusUpdateModal(stayId) {
  const stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");
  const stay = stays.find(s => s.id === stayId);
  if (!stay) return;

  document.getElementById("statusModalStayId").value = stay.id;
  document.getElementById("statusModalPetName").textContent = `${stay.petName} (${stay.id})`;
  document.getElementById("statusModalSelect").value = stay.status;
  document.getElementById("statusModalStageSelect").value = stay.stageIndex;
  document.getElementById("statusModalNotes").value = stay.latestNote || "";

  openModal("adminStatusModal");
}

function saveStatusUpdate() {
  const stayId = document.getElementById("statusModalStayId").value;
  const newStatus = document.getElementById("statusModalSelect").value;
  const newStage = parseInt(document.getElementById("statusModalStageSelect").value, 10);
  const newNote = document.getElementById("statusModalNotes").value.trim();

  let stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");
  stays = stays.map(s => {
    if (s.id === stayId) {
      return {
        ...s,
        status: newStatus,
        stageIndex: newStage,
        latestNote: newNote || s.latestNote
      };
    }
    return s;
  });

  localStorage.setItem("paws_stays", JSON.stringify(stays));
  closeModal("adminStatusModal");
  showToast(`Updated stay ${stayId} to "${newStatus}"!`, "success");
  renderAdminBookingsTable();
  renderAdminKPIs();
}

// Caretaker assignment
function openAssignCaretakerModal(stayId) {
  const stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");
  const stay = stays.find(s => s.id === stayId);
  if (!stay) return;

  document.getElementById("caretakerStayId").value = stay.id;
  document.getElementById("caretakerPetName").textContent = `${stay.petName} (${stay.serviceName})`;
  document.getElementById("caretakerSelect").value = stay.assignedCaretaker;

  openModal("adminCaretakerModal");
}

function saveCaretakerAssignment() {
  const stayId = document.getElementById("caretakerStayId").value;
  const caretakerName = document.getElementById("caretakerSelect").value;

  let stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");
  stays = stays.map(s => {
    if (s.id === stayId) {
      return { ...s, assignedCaretaker: caretakerName };
    }
    return s;
  });

  localStorage.setItem("paws_stays", JSON.stringify(stays));
  closeModal("adminCaretakerModal");
  showToast(`Assigned ${caretakerName} to stay ${stayId}`, "success");
  renderAdminBookingsTable();
}

// ---------------------------------------------------------------------------
// 4. Daily Log & Update Poster
// ---------------------------------------------------------------------------
function postNewDailyLog() {
  const petName = document.getElementById("logPetSelect").value;
  const logType = document.getElementById("logTypeSelect").value;
  const logTime = document.getElementById("logTimeInput").value || "Just now";
  const logTitle = document.getElementById("logTitleInput").value.trim();
  const logDetails = document.getElementById("logDetailsInput").value.trim();
  const staffName = document.getElementById("logStaffInput").value.trim() || "Jessica M.";

  if (!logTitle || !logDetails) {
    showToast("Please provide log title and details", "error");
    return;
  }

  let icon = "bi-cup-hot-fill";
  let badgeClass = "badge-coral";
  if (logType === "Activity") {
    icon = "bi-tree-fill";
    badgeClass = "badge-teal";
  } else if (logType === "Rest") {
    icon = "bi-cloud-moon-fill";
    badgeClass = "badge-amber";
  } else if (logType === "Health Check") {
    icon = "bi-heart-pulse-fill";
    badgeClass = "badge-coral";
  }

  const newLog = {
    id: "log-" + Date.now(),
    stayId: "STAY-9041",
    petName,
    time: logTime,
    type: logType,
    icon,
    badgeClass,
    title: logTitle,
    details: logDetails,
    staff: staffName
  };

  let logs = JSON.parse(localStorage.getItem("paws_dailyLogs") || "[]");
  logs.unshift(newLog);
  localStorage.setItem("paws_dailyLogs", JSON.stringify(logs));

  showToast(`✅ Posted ${logType} update for ${petName}! Pet owner notified.`, "success");
  document.getElementById("adminDailyLogForm").reset();
}

// ---------------------------------------------------------------------------
// 5. Pet Owners Directory
// ---------------------------------------------------------------------------
function renderAdminOwnersTable() {
  const tbody = document.getElementById("adminOwnersTbody");
  if (!tbody) return;

  const users = JSON.parse(localStorage.getItem("paws_users") || "[]");
  const stays = JSON.parse(localStorage.getItem("paws_stays") || "[]");

  tbody.innerHTML = users.map(u => {
    const userStays = stays.filter(s => s.ownerEmail === u.email);
    return `
      <tr class="hover:bg-[var(--bg-subtle)] transition border-b border-[var(--border-color)]">
        <td class="py-4 px-4">
          <div class="flex items-center gap-3">
            <img src="${u.avatar}" alt="${u.name}" class="w-10 h-10 rounded-full object-cover border">
            <div>
              <span class="font-bold text-xs text-[var(--text-main)] block">${u.name}</span>
              <span class="text-[11px] text-[var(--text-muted)]">${u.email}</span>
            </div>
          </div>
        </td>
        <td class="py-4 px-4 text-xs text-[var(--text-main)]">${u.phone || 'N/A'}</td>
        <td class="py-4 px-4 text-xs font-semibold text-[var(--brand-primary)]">${userStays.length} Stays</td>
        <td class="py-4 px-4">
          <span class="badge-pet ${u.role === 'admin' ? 'badge-purple' : 'badge-teal'} text-[10px]">
            ${u.role === 'admin' ? 'Staff' : 'Pet Parent'}
          </span>
        </td>
        <td class="py-4 px-4 text-right">
          <button onclick="showToast('Contacting ${u.name} via ${u.email}', 'info')" class="btn-brand-outline text-xs py-1 px-3 rounded-lg">
            <i class="bi bi-chat-dots"></i> Message
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ---------------------------------------------------------------------------
// 6. Registered Pets Directory
// ---------------------------------------------------------------------------
function renderAdminPetsTable() {
  const tbody = document.getElementById("adminPetsTbody");
  if (!tbody) return;

  const pets = JSON.parse(localStorage.getItem("paws_pets") || "[]");
  tbody.innerHTML = pets.map(p => `
    <tr class="hover:bg-[var(--bg-subtle)] transition border-b border-[var(--border-color)]">
      <td class="py-4 px-4">
        <div class="flex items-center gap-3">
          <img src="${p.avatar}" alt="${p.name}" class="w-10 h-10 rounded-xl object-cover border">
          <div>
            <span class="font-bold text-xs text-[var(--text-main)] block">${p.name}</span>
            <span class="text-[11px] text-[var(--text-muted)]">${p.species} • ${p.breed}</span>
          </div>
        </div>
      </td>
      <td class="py-4 px-4 text-xs text-[var(--text-muted)]">${p.age} • ${p.weight}</td>
      <td class="py-4 px-4 text-xs font-medium text-[var(--text-main)]">${p.ownerName}</td>
      <td class="py-4 px-4">
        <span class="badge-pet badge-teal text-[10px]"><i class="bi bi-shield-check"></i> ${p.vaccinationStatus}</span>
      </td>
      <td class="py-4 px-4 text-xs text-[var(--text-muted)] max-w-xs truncate">${p.specialNotes}</td>
    </tr>
  `).join('');
}

// ---------------------------------------------------------------------------
// 7. Staff Roster
// ---------------------------------------------------------------------------
function renderAdminStaffTable() {
  const tbody = document.getElementById("adminStaffTbody");
  if (!tbody) return;

  const staff = JSON.parse(localStorage.getItem("paws_staff") || "[]");
  tbody.innerHTML = staff.map(st => `
    <tr class="hover:bg-[var(--bg-subtle)] transition border-b border-[var(--border-color)]">
      <td class="py-4 px-4">
        <div class="flex items-center gap-3">
          <img src="${st.avatar}" alt="${st.name}" class="w-10 h-10 rounded-full object-cover border">
          <div>
            <span class="font-bold text-xs text-[var(--text-main)] block">${st.name}</span>
            <span class="text-[11px] text-[var(--text-muted)]">${st.role}</span>
          </div>
        </div>
      </td>
      <td class="py-4 px-4 text-xs text-[var(--text-muted)]">${st.experience}</td>
      <td class="py-4 px-4">
        <div class="flex flex-wrap gap-1">
          ${st.certifications.map(c => `<span class="badge-pet badge-teal text-[9px]">${c}</span>`).join('')}
        </div>
      </td>
      <td class="py-4 px-4">
        <span class="badge-pet badge-teal text-[10px]"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> On Duty</span>
      </td>
    </tr>
  `).join('');
}
