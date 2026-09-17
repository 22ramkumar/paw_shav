/**
 * PawsHaven - PawsLive™ Interactive Live Monitor System
 * Powers the real-time webcam stream, camera switching, live HUD telemetry,
 * interactive remote care (treat dispensing, 2-way audio), and live activity feed.
 */

const PAWS_LIVE_CAMERAS = [
  {
    id: "cam-1",
    tabId: "tabCam1",
    name: "CAM 01: Grass Agility Field",
    shortName: "Yard Agility",
    video: "videos/dog-agility.mp4",
    poster: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    location: "Outdoor Agility Meadows C",
    statusBadge: "Active in Playgroup",
    fps: "60 FPS",
    bitrate: "2.8 Mb/s",
    caretakerNote: "Max is energetic, clearing agility ramps and chasing balls with play buddies."
  },
  {
    id: "cam-2",
    tabId: "tabCam2",
    name: "CAM 02: Indoor Play Haven",
    shortName: "Indoor Play",
    video: "videos/indoor-play-toys.mp4",
    poster: "images/indoor-play-101218.jpg",
    location: "Climate-Controlled Arena B",
    statusBadge: "Indoor Socialization",
    fps: "60 FPS",
    bitrate: "3.1 Mb/s",
    caretakerNote: "Max is actively playing with rope tug and chew toys in Climate Arena B."
  },
  {
    id: "cam-3",
    tabId: "tabCam3",
    name: "CAM 03: Splash Pool & Suites",
    shortName: "Splash Pool",
    video: "videos/splash-pool.mp4",
    poster: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80",
    location: "Hydro-Jet Splash Zone & Penthouse",
    statusBadge: "Hydro-Play & Cooling",
    fps: "60 FPS",
    bitrate: "2.5 Mb/s",
    caretakerNote: "Puppy swimming session underway in hydro-jet splash zone; warm towel dry scheduled."
  }
];

let activePawsCamIndex = 0;
let isPawsLivePlaying = true;
let isPawsLiveMuted = true;
let pawsLiveZoomLevel = 1; // 1 -> 1.35 -> 1.7 -> 1
let isPawsNightVision = false;
let treatsRemaining = 3;
let isSpeakingTwoWay = false;
let pawsLiveClockTimer = null;
let pawsLiveVitalsTimer = null;

function initPawsLiveMonitor() {
  const video = document.getElementById("pawsLiveVideo");
  if (!video) return;

  // Start real-time live clock ticking
  updatePawsLiveClock();
  if (pawsLiveClockTimer) clearInterval(pawsLiveClockTimer);
  pawsLiveClockTimer = setInterval(updatePawsLiveClock, 1000);

  // Start simulated realistic pet vitals oscillation
  if (pawsLiveVitalsTimer) clearInterval(pawsLiveVitalsTimer);
  pawsLiveVitalsTimer = setInterval(updatePawsLiveVitals, 2800);

  // Autoplay video with sound muted (browser requirement)
  video.muted = true;
  video.play().then(() => {
    isPawsLivePlaying = true;
    updatePlayPauseButtonUI(true);
  }).catch(() => {
    // Autoplay fallback handled gracefully
    isPawsLivePlaying = false;
    updatePlayPauseButtonUI(false);
  });
}

function updatePawsLiveClock() {
  const clockEl = document.getElementById("pawsLiveClock");
  if (!clockEl) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  clockEl.innerText = `${timeStr} • ${dateStr}`;
}

function updatePawsLiveVitals() {
  const bpmEl = document.getElementById("pawsLiveHeartRate");
  if (!bpmEl) return;
  // Natural realistic variation between 80 - 87 BPM for active Golden Retriever
  const randomBpm = 80 + Math.floor(Math.random() * 8);
  bpmEl.innerText = `${randomBpm} BPM`;
}

function switchPawsLiveCam(camIndex) {
  if (camIndex < 0 || camIndex >= PAWS_LIVE_CAMERAS.length) return;
  activePawsCamIndex = camIndex;
  const cam = PAWS_LIVE_CAMERAS[camIndex];

  // Update tabs UI
  const tabs = ["tabCam1", "tabCam2", "tabCam3"];
  tabs.forEach((id, idx) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (idx === camIndex) {
      btn.className = "cam-tab-btn py-2.5 px-3 rounded-xl bg-[var(--brand-primary)] text-white shadow-md font-bold text-xs transition transform scale-[1.02] flex items-center justify-center gap-1.5";
      btn.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>${cam.shortName}</span>`;
    } else {
      btn.className = "cam-tab-btn py-2.5 px-3 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:bg-[var(--border-color)] hover:text-[var(--text-main)] font-semibold text-xs transition flex items-center justify-center gap-1.5";
      btn.innerHTML = `<span>${PAWS_LIVE_CAMERAS[idx].shortName}</span>`;
    }
  });

  // Camera transition effect
  const transitionOverlay = document.getElementById("pawsLiveTransitionOverlay");
  const video = document.getElementById("pawsLiveVideo");
  const camBadge = document.getElementById("pawsLiveCamBadge");
  const locationBadge = document.getElementById("pawsLiveLocationBadge");
  const caretakerQuote = document.getElementById("pawsLiveCaretakerQuote");
  const statusBadge = document.getElementById("pawsLivePetStatusBadge");
  const telemetryBadge = document.getElementById("pawsLiveTelemetry");

  if (transitionOverlay) {
    transitionOverlay.classList.remove("hidden");
    transitionOverlay.classList.add("flex");
  }

  if (camBadge) camBadge.innerText = cam.name;
  if (locationBadge) locationBadge.innerText = cam.location;
  if (caretakerQuote) caretakerQuote.innerText = `"${cam.caretakerNote}"`;
  if (statusBadge) statusBadge.innerText = cam.statusBadge;
  if (telemetryBadge) telemetryBadge.innerText = `${cam.fps} • ${cam.resolution} • ${cam.bitrate}`;

  setTimeout(() => {
    if (video) {
      video.src = cam.video;
      video.poster = cam.poster;
      video.load();
      video.play().then(() => {
        isPawsLivePlaying = true;
        updatePlayPauseButtonUI(true);
      }).catch(() => {});
    }
    if (transitionOverlay) {
      transitionOverlay.classList.add("hidden");
      transitionOverlay.classList.remove("flex");
    }
    if (typeof showToast === "function") {
      showToast(`Switched to ${cam.shortName} Live Feed (${cam.resolution} 60 FPS)`, "info", 2000);
    }
  }, 300);
}

function togglePawsLivePlay() {
  const video = document.getElementById("pawsLiveVideo");
  if (!video) return;

  if (video.paused) {
    video.play().then(() => {
      isPawsLivePlaying = true;
      updatePlayPauseButtonUI(true);
      if (typeof showToast === "function") showToast("PawsLive™ stream resumed", "info", 1500);
    });
  } else {
    video.pause();
    isPawsLivePlaying = false;
    updatePlayPauseButtonUI(false);
    if (typeof showToast === "function") showToast("PawsLive™ stream paused", "info", 1500);
  }
}

function updatePlayPauseButtonUI(playing) {
  const btn = document.getElementById("pawsLivePlayBtn");
  const liveIndicator = document.getElementById("pawsLiveIndicatorPill");
  if (btn) {
    btn.innerHTML = playing ? `<i class="bi bi-pause-fill text-sm"></i>` : `<i class="bi bi-play-fill text-sm ml-0.5"></i>`;
    btn.title = playing ? "Pause Stream" : "Resume Stream";
  }
  if (liveIndicator) {
    if (playing) {
      liveIndicator.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span><span class="font-bold text-[10px] text-white uppercase tracking-wider">LIVE</span>`;
      liveIndicator.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white backdrop-blur-md shadow-xs border border-red-400/30";
    } else {
      liveIndicator.innerHTML = `<i class="bi bi-pause-circle text-[10px]"></i><span class="font-bold text-[10px] uppercase tracking-wider">PAUSED</span>`;
      liveIndicator.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/90 text-white backdrop-blur-md shadow-xs border border-amber-300/30";
    }
  }
}

function togglePawsLiveMute() {
  const video = document.getElementById("pawsLiveVideo");
  const btn = document.getElementById("pawsLiveMuteBtn");
  if (!video) return;

  video.muted = !video.muted;
  isPawsLiveMuted = video.muted;

  if (btn) {
    btn.innerHTML = video.muted ? `<i class="bi bi-volume-mute-fill text-sm"></i>` : `<i class="bi bi-volume-up-fill text-sm text-emerald-400"></i>`;
    btn.title = video.muted ? "Unmute Audio" : "Mute Audio";
  }

  if (typeof showToast === "function") {
    showToast(video.muted ? "Yard Microphone: Muted" : "Yard Microphone: Streaming Live Audio 🔊", "info", 2000);
  }
}

function capturePawsLiveSnapshot() {
  const flash = document.getElementById("pawsLiveFlash");
  if (flash) {
    flash.classList.remove("hidden");
    flash.classList.add("opacity-100");
    setTimeout(() => {
      flash.classList.remove("opacity-100");
      setTimeout(() => flash.classList.add("hidden"), 300);
    }, 150);
  }

  const cam = PAWS_LIVE_CAMERAS[activePawsCamIndex];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add event to live timeline
  prependLiveTimelineItem({
    icon: "bi-camera-fill",
    iconBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400",
    title: "Parent Photo Snapshot Captured",
    subtitle: `${timeStr} • High-Res 1080p Frame Saved to Album`,
    isNew: true
  });

  if (typeof showToast === "function") {
    showToast(`📸 Snapshot captured from ${cam.shortName}! Saved to Max's digital album.`, "success", 3500);
  }
}

function togglePawsLiveZoom() {
  const video = document.getElementById("pawsLiveVideo");
  const btn = document.getElementById("pawsLiveZoomBtn");
  if (!video) return;

  if (pawsLiveZoomLevel === 1) {
    pawsLiveZoomLevel = 1.35;
  } else if (pawsLiveZoomLevel === 1.35) {
    pawsLiveZoomLevel = 1.7;
  } else {
    pawsLiveZoomLevel = 1;
  }

  video.style.transform = `scale(${pawsLiveZoomLevel})`;
  video.style.transformOrigin = "center center";

  if (btn) {
    btn.innerHTML = `<span class="text-[9px] font-black font-mono">${pawsLiveZoomLevel === 1 ? '1x' : pawsLiveZoomLevel + 'x'}</span>`;
    btn.title = `Digital Zoom: ${pawsLiveZoomLevel}x`;
  }

  if (typeof showToast === "function") {
    showToast(`Digital Zoom: ${pawsLiveZoomLevel}x`, "info", 1500);
  }
}

function togglePawsLiveNightVision() {
  const video = document.getElementById("pawsLiveVideo");
  const btn = document.getElementById("pawsLiveNightVisionBtn");
  const nvBadge = document.getElementById("pawsLiveNightVisionBadge");
  if (!video) return;

  isPawsNightVision = !isPawsNightVision;

  if (isPawsNightVision) {
    video.style.filter = "contrast(1.3) brightness(1.2) sepia(0.5) hue-rotate(85deg)";
    if (btn) btn.classList.add("text-emerald-400", "ring-1", "ring-emerald-400");
    if (nvBadge) nvBadge.classList.remove("hidden");
    if (typeof showToast === "function") showToast("🌙 Night Vision IR mode active", "info", 2000);
  } else {
    video.style.filter = "none";
    if (btn) btn.classList.remove("text-emerald-400", "ring-1", "ring-emerald-400");
    if (nvBadge) nvBadge.classList.add("hidden");
    if (typeof showToast === "function") showToast("☀️ Daylight TrueColor mode restored", "info", 2000);
  }
}

function togglePawsLiveFullscreen() {
  const container = document.getElementById("pawsLiveVideoContainer");
  if (!container) return;

  if (!document.fullscreenElement) {
    if (container.requestFullscreen) container.requestFullscreen();
    else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

function dispenseLiveTreat() {
  const btn = document.getElementById("pawsLiveTreatBtn");
  if (treatsRemaining <= 0) {
    if (typeof showToast === "function") {
      showToast("Daily treat allotment reached (3 of 3 dispensed). Vet recommends waiting until dinner.", "info", 3500);
    }
    return;
  }

  treatsRemaining--;
  const treatCounter = document.getElementById("pawsLiveTreatsCount");
  if (treatCounter) treatCounter.innerText = `${treatsRemaining} treats remaining today`;

  // Visual bone drop animation overlay
  const treatAnim = document.getElementById("pawsLiveTreatAnimation");
  if (treatAnim) {
    treatAnim.classList.remove("hidden");
    treatAnim.classList.add("flex");
    setTimeout(() => {
      treatAnim.classList.add("hidden");
      treatAnim.classList.remove("flex");
    }, 1800);
  }

  // Add event to live timeline
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  prependLiveTimelineItem({
    icon: "bi-gift-fill",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
    title: "Organic Treat Dispensed",
    subtitle: `${timeStr} • Salmon Bone Biscuit via Remote Chime`,
    isNew: true
  });

  if (typeof showToast === "function") {
    showToast("🦴 Organic treat dispensed! Chime played in yard. Max is enjoying his biscuit!", "success", 4000);
  }

  // Button cooldown
  if (btn) {
    btn.disabled = true;
    let secondsLeft = 10;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-hourglass-split animate-spin"></i> Dispensing (${secondsLeft}s)...`;
    btn.classList.add("opacity-70");

    const timer = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        btn.innerHTML = `<i class="bi bi-hourglass-split"></i> Cooldown (${secondsLeft}s)...`;
      } else {
        clearInterval(timer);
        btn.disabled = false;
        btn.classList.remove("opacity-70");
        btn.innerHTML = originalText;
      }
    }, 1000);
  }
}

function toggleTwoWayAudio() {
  const btn = document.getElementById("pawsLiveSpeakerBtn");
  const waveOverlay = document.getElementById("pawsLiveAudioWave");
  if (!btn) return;

  isSpeakingTwoWay = !isSpeakingTwoWay;

  if (isSpeakingTwoWay) {
    btn.innerHTML = `<i class="bi bi-mic-fill text-rose-500 animate-pulse"></i><span>Speaking Live to Yard...</span>`;
    btn.className = "py-2.5 px-3 rounded-xl border-2 border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm w-full";
    if (waveOverlay) waveOverlay.classList.remove("hidden");
    if (typeof showToast === "function") {
      showToast("🎙️ Intercom connected! Speaking to yard speaker: 'Good boy Max!'", "info", 3000);
    }
  } else {
    btn.innerHTML = `<i class="bi bi-mic-fill text-[var(--brand-primary)] dark:text-emerald-400"></i><span>Two-Way Yard Speaker</span>`;
    btn.className = "btn-brand-outline py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition w-full";
    if (waveOverlay) waveOverlay.classList.add("hidden");
    if (typeof showToast === "function") {
      showToast("Intercom disconnected.", "info", 1500);
    }
  }
}

function refreshPawsLiveStream() {
  const refreshIcon = document.getElementById("pawsLiveRefreshIcon");
  if (refreshIcon) refreshIcon.classList.add("animate-spin");

  const video = document.getElementById("pawsLiveVideo");
  if (video) {
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  setTimeout(() => {
    if (refreshIcon) refreshIcon.classList.remove("animate-spin");
    if (typeof showToast === "function") {
      showToast("PawsLive™ stream re-synchronized (0ms latency • 60 FPS)", "success", 2500);
    }
  }, 600);
}

function prependLiveTimelineItem({ icon, iconBg, title, subtitle, isNew = false }) {
  const timeline = document.getElementById("pawsLiveTimelineList");
  if (!timeline) return;

  const item = document.createElement("div");
  item.className = "flex items-start gap-2.5 transition-all duration-300 animate-fadeIn";
  item.innerHTML = `
    <div class="w-6 h-6 rounded-full ${iconBg} flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-xs">
      <i class="bi ${icon}"></i>
    </div>
    <div class="flex-1">
      <div class="flex items-center gap-1.5">
        <span class="font-bold text-[var(--text-main)] block text-xs leading-snug">${title}</span>
        ${isNew ? '<span class="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider dark:bg-emerald-950 dark:text-emerald-300">NEW</span>' : ''}
      </div>
      <span class="text-[10px] text-[var(--text-muted)] block mt-0.5">${subtitle}</span>
    </div>
  `;

  timeline.insertBefore(item, timeline.firstChild);
}

// Initialize on DOM ready or immediate
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPawsLiveMonitor);
} else {
  initPawsLiveMonitor();
}
