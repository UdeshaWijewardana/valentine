/* script.js (FULL UPDATED - keeps all animations/design) */

/* ================= CONFIG ================= */
const CONFIG = {
  mainQuestion: "Dahami… will you be my Valentine? 💕",
  subQuestion: "Malli Baba is asking… please say YES 😚",
  yesButton: "YES 💗",
  noButton: "NO 🙈",
  noEscapeTexts: [
    "Hey Dahami Modaya 😝 NO is not allowed!",
    "Modaya… just tap YES 😘",
    "Okay okay… Malli Baba already knows your answer 💞"
  ],
  confirmTitle: "YAAAY Dahami! 💖",
  confirmText: "From today, you are officially…",
  badgeText: "Malli Baba’s Valentine 💘",
  nextButton: "Next",
  repeatButton: "Ask again",
  flowerTitle: "A special gift for you, Dahami 🌸",
  takeBouquetButton: "Take my gift 🎁",
  bouquetMessage: "It’s yours now, Modaya 💕",
  nextFlowerButton: "Next",
  collageTitle: "My Beautiful Dahami 💞",
  collageSubtitle:
    "Since you came into my life, even simple moments feel special. Happy Valentine, my favorite person. 💕",
  nextCollageButton: "One more page…",
  finalTitle: "Happy Valentine, Dahami 💞",
  finalMessage: `Dahami Modaya, thank you for loving Malli Baba. You make my life feel calm and happy. I’m always here for you. Happy Valentine, my love 💕`,
  restartButton: "Restart",
  copyButton: "Copy Message",
  copySuccess: "Message copied! 💗"
};

const state = {
  currentPage: 1,
  hasClickedYes: false,
  noClickCount: 0,
  bouquetTaken: false,
  musicPlaying: false
};

let elements = null;

/* ================= HELPERS ================= */
function $(id) {
  return document.getElementById(id);
}
function safeText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}
function safeQuery(sel) {
  return document.querySelector(sel);
}

/* ================= MUSIC ================= */
function toggleMusic() {
  if (!elements?.bgMusic) return;

  if (!state.musicPlaying) {
    elements.bgMusic.muted = false;
    elements.bgMusic.play().then(() => {
      state.musicPlaying = true;
      elements.musicBtn?.classList.add("playing");
    }).catch(() => {});
  } else {
    elements.bgMusic.pause();
    state.musicPlaying = false;
    elements.musicBtn?.classList.remove("playing");
  }
}

function initAutoplayMusic() {
  if (!elements?.bgMusic) return;

  elements.bgMusic.loop = true;
  elements.bgMusic.preload = "auto";

  // try muted autoplay
  elements.bgMusic.muted = true;
  const p = elements.bgMusic.play();
  if (p && typeof p.then === "function") {
    p.then(() => {
      state.musicPlaying = true;
      elements.musicBtn?.classList.add("playing");
    }).catch(() => {});
  }

  document.addEventListener("visibilitychange", () => {
    if (!elements?.bgMusic) return;
    if (document.hidden && state.musicPlaying) elements.bgMusic.pause();
    else if (!document.hidden && state.musicPlaying) elements.bgMusic.play().catch(() => {});
  });
}

function forceStartMusicOnFirstClick() {
  if (!elements?.bgMusic) return;

  const start = () => {
    elements.bgMusic.muted = false;
    elements.bgMusic.play().then(() => {
      state.musicPlaying = true;
      elements.musicBtn?.classList.add("playing");
    }).catch(() => {});
  };

  document.addEventListener("click", start, { once: true });
  elements.yesBtn?.addEventListener("click", start, { once: true });
}

/* ================= SPARKLES ================= */
function createSparkles() {
  if (!elements?.sparkleContainer) return;
  elements.sparkleContainer.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.animationDelay = Math.random() * 2 + "s";
    sparkle.style.animationDuration = (Math.random() * 2 + 1.5) + "s";
    elements.sparkleContainer.appendChild(sparkle);
  }
}

/* ================= PETALS ================= */
let petalInterval = null;

function startFallingPetals() {
  if (!elements?.petalsContainer) return;

  elements.petalsContainer.innerHTML = "";
  for (let i = 0; i < 15; i++) setTimeout(() => createPetal(), i * 180);

  if (petalInterval) clearInterval(petalInterval);
  petalInterval = setInterval(() => {
    if (state.currentPage === 3) createPetal();
  }, 600);
}

function createPetal() {
  if (!elements?.petalsContainer) return;

  const petal = document.createElement("div");
  petal.className = "petal";

  const colors = ["#f9a8d4", "#f472b6", "#ec4899", "#fbcfe8"];
  petal.style.background = `linear-gradient(135deg,
    ${colors[Math.floor(Math.random() * colors.length)]},
    ${colors[Math.floor(Math.random() * colors.length)]})`;

  petal.style.left = Math.random() * 100 + "%";
  petal.style.animationDuration = (Math.random() * 4 + 5) + "s";

  const size = Math.random() * 18 + 12;
  petal.style.width = size + "px";
  petal.style.height = size + "px";
  petal.style.opacity = (Math.random() * 0.4 + 0.4).toFixed(2);

  elements.petalsContainer.appendChild(petal);
  setTimeout(() => petal.remove(), 9000);
}

/* ================= CONFETTI ================= */
function triggerConfetti() {
  if (!elements?.confettiContainer) return;

  elements.confettiContainer.innerHTML = "";
  const hearts = ["💖", "💕", "💗", "💓", "💞", "💝", "❤️", "🩷", "✨", "🌸"];

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const confetti = document.createElement("span");
      confetti.className = "confetti-heart";
      confetti.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.fontSize = (Math.random() * 1.8 + 1) + "rem";
      confetti.style.animationDelay = Math.random() * 0.3 + "s";

      elements.confettiContainer.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4500);
    }, i * 50);
  }
}

/* ================= PAGE 6 (Square Ring + Center Videos) =================
   ✅ 26 images loop around a square ring
   ✅ 6 videos centered (muted autoplay, loop)
   ✅ No crop (object-fit: contain)
*/

// If your files are exactly: assets/media/1.jpg ... 26.jpg
const RING_IMAGES = Array.from({ length: 26 }, (_, i) => `assets/media/${i + 1}.jpg`);

// If your files are exactly: assets/media/video1.mp4 ... video6.mp4
const CENTER_VIDEOS = Array.from({ length: 6 }, (_, i) => `assets/media/video${i + 1}.mp4`);

let ringThumbEls = [];
let ringTimer = null;

// Create 26 fixed positions around a "square path"
function squarePathPos(t, paddingPct = 6) {
  // t: 0..1
  const pad = paddingPct;
  const a = 100 - pad;
  const b = pad;

  // 4 equal segments
  const s = t * 4;
  const seg = Math.floor(s);
  const u = s - seg;

  if (seg === 0) {
    // top: left -> right
    return { x: b + (a - b) * u, y: b };
  }
  if (seg === 1) {
    // right: top -> bottom
    return { x: a, y: b + (a - b) * u };
  }
  if (seg === 2) {
    // bottom: right -> left
    return { x: a - (a - b) * u, y: a };
  }
  // left: bottom -> top
  return { x: b, y: a - (a - b) * u };
}

function buildSquareRing() {
  const ring = $("squareRing");
  if (!ring) return;

  ring.innerHTML = "";
  ringThumbEls = [];

  const n = RING_IMAGES.length;

  for (let i = 0; i < n; i++) {
    const t = i / n;
    const pos = squarePathPos(t, 6);

    const thumb = document.createElement("div");
    thumb.className = "square-thumb";
    thumb.style.left = pos.x + "%";
    thumb.style.top = pos.y + "%";
    thumb.style.animationDelay = (Math.random() * 1.6).toFixed(2) + "s";

    const img = document.createElement("img");
    img.src = RING_IMAGES[i];
    img.alt = "Memory";
    img.loading = "lazy";

    thumb.appendChild(img);
    ring.appendChild(thumb);
    ringThumbEls.push(img);
  }
}

function startSquareRingLoop() {
  stopSquareRingLoop();
  if (!ringThumbEls.length) return;

  let offset = 0;

  ringTimer = setInterval(() => {
    offset = (offset + 1) % RING_IMAGES.length;

    for (let i = 0; i < ringThumbEls.length; i++) {
      const imgEl = ringThumbEls[i];
      const src = RING_IMAGES[(i + offset) % RING_IMAGES.length];
      if (imgEl && imgEl.getAttribute("src") !== src) imgEl.src = src;
    }
  }, 1300);
}

function stopSquareRingLoop() {
  if (ringTimer) {
    clearInterval(ringTimer);
    ringTimer = null;
  }
}

function playCenterVideos() {
  const container = $("centerVideos");
  if (!container) return;

  const vids = Array.from(container.querySelectorAll("video"));
  vids.forEach((v, i) => {
    // If you want to force your own list, use CENTER_VIDEOS:
    const source = v.querySelector("source");
    if (source && CENTER_VIDEOS[i]) source.src = CENTER_VIDEOS[i];

    v.muted = true;
    v.loop = true;
    v.autoplay = true;
    v.playsInline = true;
    v.load?.();
    v.play().catch(() => {});
  });
}

function onEnterPage6() {
  buildSquareRing();
  startSquareRingLoop();
  playCenterVideos();

  // If you still keep old masonry/sequence elements in HTML (hidden), this won't break anything.
}


/* ================= NAVIGATION ================= */
function navigateTo(pageNumber) {
  // Stop page6 loop when leaving
  if (state.currentPage === 6 && pageNumber !== 6) {
    stopSquareRingLoop();
  }
  const currentPageEl = $(`page${state.currentPage}`);
  const nextPageEl = $(`page${pageNumber}`);
  if (!currentPageEl || !nextPageEl) return;

  currentPageEl.classList.add("fade-out");
  currentPageEl.classList.remove("active");

  setTimeout(() => {
    currentPageEl.classList.remove("fade-out");
    nextPageEl.classList.add("active");
    state.currentPage = pageNumber;

    if (pageNumber === 5) resetEnvelope();
    if (pageNumber === 3) startFallingPetals();
    if (pageNumber === 6) onEnterPage6();
  }, 400);
}

/* ================= BUTTON HANDLERS ================= */
function handleYesClick() {
  state.hasClickedYes = true;
  navigateTo(2);
}

function handleNoClick() {
  state.noClickCount++;

  elements.noBtn?.classList.add("shake");
  setTimeout(() => elements.noBtn?.classList.remove("shake"), 500);

  if (state.noClickCount <= 2) {
    if (elements.noEscapeText) {
      elements.noEscapeText.textContent = CONFIG.noEscapeTexts[state.noClickCount - 1];
      elements.noEscapeText.classList.remove("hidden");
    }
  } else {
    if (elements.noEscapeText) {
      elements.noEscapeText.textContent = CONFIG.noEscapeTexts[2];
      elements.noEscapeText.classList.remove("hidden");
    }
    setTimeout(() => navigateTo(2), 1500);
  }
}

function handleTakeBouquet() {
  if (state.bouquetTaken) return;
  state.bouquetTaken = true;

  const before = $("giftBefore");
  const after = $("giftTakenGif") || $("giftAfter");
  if (before) before.classList.add("hidden");
  if (after) after.classList.remove("hidden");

  elements.bouquet?.classList.add("bounce");
  setTimeout(() => elements.bouquet?.classList.remove("bounce"), 800);

  elements.bouquetMessage?.classList.remove("hidden");
  elements.takeBouquet?.classList.add("hidden");
  elements.nextToPage4?.classList.remove("hidden");
}

/* ================= ENVELOPE ================= */
function resetEnvelope() {
  if (!elements?.envelopeWrapper || !elements?.envelope || !elements?.finalContent) return;

  elements.envelopeWrapper.classList.remove("hidden", "fade-out");
  elements.envelope.classList.remove("opened", "letter-exit");
  elements.finalContent.classList.add("hidden");
  elements.finalContent.classList.remove("reveal");

  const hint = $("envelopeHint");
  if (hint) hint.classList.remove("fade");
}

function handleEnvelopeClick() {
  if (!elements?.envelope || !elements?.envelopeWrapper || !elements?.finalContent) return;
  if (elements.envelope.classList.contains("opened")) return;

  const hint = $("envelopeHint");
  elements.envelope.classList.add("opened");
  if (hint) hint.classList.add("fade");

  setTimeout(() => elements.envelope.classList.add("letter-exit"), 600);
  setTimeout(() => elements.envelopeWrapper.classList.add("fade-out"), 1200);

  setTimeout(() => {
    elements.envelopeWrapper.classList.add("hidden");
    elements.finalContent.classList.remove("hidden");
    elements.finalContent.classList.add("reveal");
    triggerConfetti();
  }, 1700);
}

/* ================= COPY + RESTART ================= */
function handleCopyMessage() {
  const msg = CONFIG.finalMessage;

  navigator.clipboard.writeText(msg).then(() => {
    elements.copyNotif?.classList.remove("hidden");
    setTimeout(() => elements.copyNotif?.classList.add("hidden"), 2500);
  }).catch(() => {
    const t = document.createElement("textarea");
    t.value = msg;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    document.body.removeChild(t);

    elements.copyNotif?.classList.remove("hidden");
    setTimeout(() => elements.copyNotif?.classList.add("hidden"), 2500);
  });
}

function handleRestart() {
  state.hasClickedYes = false;
  state.noClickCount = 0;
  state.bouquetTaken = false;

  elements.noEscapeText?.classList.add("hidden");
  elements.bouquetMessage?.classList.add("hidden");
  elements.takeBouquet?.classList.remove("hidden");
  elements.nextToPage4?.classList.add("hidden");

  const before = $("giftBefore");
  const after = $("giftTakenGif") || $("giftAfter");
  if (before) before.classList.remove("hidden");
  if (after) after.classList.add("hidden");

  if (elements.confettiContainer) elements.confettiContainer.innerHTML = "";
  navigateTo(1);
}

/* ================= BACKGROUND HEART CANVAS ================= */
class HeartParticle {
  constructor(canvas) { this.canvas = canvas; this.reset(); }
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = this.canvas.height + 50;
    this.size = Math.random() * 18 + 10;
    this.speedY = Math.random() * 1.2 + 0.6;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.opacity = Math.random() * 0.5 + 0.25;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.025;
    const colors = [
      "rgba(244,114,182,",
      "rgba(236,72,153,",
      "rgba(251,113,133,",
      "rgba(249,168,212,",
      "rgba(232,121,249,"
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.4;
    this.rotation += this.rotationSpeed;
    if (this.y < -50) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.fillStyle = this.color + this.opacity + ")";
    const s = this.size;
    ctx.moveTo(0, s / 4);
    ctx.bezierCurveTo(s / 2, -s / 2, s, s / 4, 0, s);
    ctx.bezierCurveTo(-s, s / 4, -s / 2, -s / 2, 0, s / 4);
    ctx.fill();
    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.canvas = elements?.heartCanvas;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 35;

    this.resize();
    this.init();
    this.animate();
    window.addEventListener("resize", () => this.resize());
  }
  resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const p = new HeartParticle(this.canvas);
      p.y = Math.random() * this.canvas.height;
      this.particles.push(p);
    }
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => { p.update(); p.draw(this.ctx); });
    requestAnimationFrame(() => this.animate());
  }
}

/* ================= APPLY TEXT ================= */
function applyConfig() {
  safeText("mainQuestion", CONFIG.mainQuestion);
  safeText("subQuestion", CONFIG.subQuestion);

  const yesText = elements.yesBtn?.querySelector(".btn-text");
  if (yesText) yesText.textContent = CONFIG.yesButton;

  const noText = elements.noBtn?.querySelector(".btn-text");
  if (noText) noText.textContent = CONFIG.noButton;

  safeText("confirmTitle", CONFIG.confirmTitle);
  safeText("confirmText", CONFIG.confirmText);

  const badge = safeQuery(".badge-text");
  if (badge) badge.textContent = CONFIG.badgeText;

  const next3Text = elements.nextToPage3?.querySelector(".btn-text");
  if (next3Text) next3Text.textContent = CONFIG.nextButton;

  if (elements.backToPage1) elements.backToPage1.textContent = CONFIG.repeatButton;

  safeText("flowerTitle", CONFIG.flowerTitle);

  const takeText = elements.takeBouquet?.querySelector(".btn-text");
  if (takeText) takeText.textContent = CONFIG.takeBouquetButton;

  if (elements.bouquetMessage) elements.bouquetMessage.textContent = CONFIG.bouquetMessage;

  const next4Text = elements.nextToPage4?.querySelector(".btn-text");
  if (next4Text) next4Text.textContent = CONFIG.nextFlowerButton;

  safeText("collageTitle", CONFIG.collageTitle);
  safeText("collageSubtitle", CONFIG.collageSubtitle);

  safeText("finalTitle", CONFIG.finalTitle);
  safeText("finalMessage", CONFIG.finalMessage);

  if (elements.copyNotif) elements.copyNotif.textContent = CONFIG.copySuccess;

  const hint = $("envelopeHint");
  if (hint) hint.textContent = "Tap to open";
}

/* ================= CURSOR HEART TRAIL ================= */
function initMouseTrail() {
  const hearts = ["💕", "💗", "💖", "💓", "🩷", "✨"];
  let lastTime = 0;
  const throttleMs = 120;

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTime < throttleMs) return;
    lastTime = now;

    const heart = document.createElement("span");
    heart.className = "cursor-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";
    heart.style.fontSize = (Math.random() * 10 + 10) + "px";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  });
}

/* ================= EVENT LISTENERS ================= */
function initEventListeners() {
  elements.yesBtn?.addEventListener("click", handleYesClick);
  elements.noBtn?.addEventListener("click", handleNoClick);

  elements.nextToPage3?.addEventListener("click", () => navigateTo(3));
  elements.backToPage1?.addEventListener("click", () => navigateTo(1));

  elements.takeBouquet?.addEventListener("click", handleTakeBouquet);
  elements.nextToPage4?.addEventListener("click", () => navigateTo(4));

  // Page4 -> Page6
  elements.nextToPage6?.addEventListener("click", () => navigateTo(6));

  // Page6 -> Page5
  elements.nextToPage5?.addEventListener("click", () => navigateTo(5));

  elements.restartBtn?.addEventListener("click", handleRestart);
  elements.copyBtn?.addEventListener("click", handleCopyMessage);

  elements.musicBtn?.addEventListener("click", toggleMusic);
  elements.envelopeWrapper?.addEventListener("click", handleEnvelopeClick);
}

/* ================= BUILD ELEMENTS ================= */
function buildElements() {
  elements = {
    pages: document.querySelectorAll(".page"),

    yesBtn: $("yesBtn"),
    noBtn: $("noBtn"),
    noEscapeText: $("noEscapeText"),

    nextToPage3: $("nextToPage3"),
    backToPage1: $("backToPage1"),

    bouquet: $("bouquet"),
    takeBouquet: $("takeBouquet"),
    nextToPage4: $("nextToPage4"),
    bouquetMessage: $("bouquetMessage"),
    petalsContainer: $("petalsContainer"),

    nextToPage6: $("nextToPage6"),
    nextToPage5: $("nextToPage5"),

    restartBtn: $("restartBtn"),
    copyBtn: $("copyBtn"),
    copyNotif: $("copyNotif"),

    confettiContainer: $("confettiContainer"),

    musicBtn: $("musicBtn"),
    bgMusic: $("bgMusic"),

    heartCanvas: $("heartCanvas"),
    sparkleContainer: $("sparkleContainer"),

    envelopeWrapper: $("envelopeWrapper"),
    envelope: $("envelope"),
    finalContent: $("finalContent")
  };
}

/* ================= START ================= */
document.addEventListener("DOMContentLoaded", () => {
  buildElements();
  applyConfig();
  initEventListeners();
  createSparkles();
  new ParticleSystem();
  initMouseTrail();

  initAutoplayMusic();
  forceStartMusicOnFirstClick();
});
