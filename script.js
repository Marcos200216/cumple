const btn = document.getElementById("btnCorte");
const motoImg = document.querySelector(".moto-img");

let audioCtx;
let bufferSourceArranque;
let bufferSourceCorte;
let corteGainNode;
let arranqueGainNode;
let corteBuffer;
let arranqueBuffer;
let isAudioInitialized = false;

// Inicializar AudioContext y buffers al primer toque
async function inicializarAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Cargar arranque
  const arranqueRes = await fetch("arranque.mp3");
  const arranqueArrayBuffer = await arranqueRes.arrayBuffer();
  arranqueBuffer = await audioCtx.decodeAudioData(arranqueArrayBuffer);

  // Cargar corte
  const corteRes = await fetch("corte.mp3");
  const corteArrayBuffer = await corteRes.arrayBuffer();
  corteBuffer = await audioCtx.decodeAudioData(corteArrayBuffer);

  isAudioInitialized = true;

  // Reproducir arranque en loop bajo
  bufferSourceArranque = audioCtx.createBufferSource();
  bufferSourceArranque.buffer = arranqueBuffer;
  bufferSourceArranque.loop = true;

  arranqueGainNode = audioCtx.createGain();
  arranqueGainNode.gain.value = 0.6;

  bufferSourceArranque.connect(arranqueGainNode).connect(audioCtx.destination);
  bufferSourceArranque.start(0);
}

// Reproducir sonido de corte en loop
function reproducirCorteLoop() {
  if (!corteBuffer || !audioCtx) return;

  if (bufferSourceCorte) {
    bufferSourceCorte.stop(0);
    bufferSourceCorte.disconnect();
    bufferSourceCorte = null;
  }

  bufferSourceCorte = audioCtx.createBufferSource();
  bufferSourceCorte.buffer = corteBuffer;
  bufferSourceCorte.loop = true;

  corteGainNode = audioCtx.createGain();
  corteGainNode.gain.value = 1.0;

  bufferSourceCorte.connect(corteGainNode).connect(audioCtx.destination);
  bufferSourceCorte.start(0);
}

// Detener sonido de corte
function detenerCorteLoop() {
  if (bufferSourceCorte) {
    bufferSourceCorte.stop(0);
    bufferSourceCorte.disconnect();
    bufferSourceCorte = null;
  }
}

// Iniciar sonido y animación
function startCorte() {
  if (!isAudioInitialized) return;
  reproducirCorteLoop();
  motoImg.classList.add("vibrando");
  document.body.classList.add("fondo-activo");
}

// Detener todo
function stopCorte() {
  detenerCorteLoop();
  motoImg.classList.remove("vibrando");
  document.body.classList.remove("fondo-activo");
}

// Eventos mouse
btn.addEventListener("mousedown", startCorte);
btn.addEventListener("mouseup", stopCorte);
btn.addEventListener("mouseleave", stopCorte);

// Eventos touch (móviles)
btn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startCorte();
});
btn.addEventListener("touchend", stopCorte);
btn.addEventListener("touchcancel", stopCorte);

// Modal de felicidades
const btnVerMas = document.getElementById("btnVerMas");
const modal = document.getElementById("modalFelicidades");
const spanClose = document.querySelector(".close");

btnVerMas.addEventListener("click", () => {
  modal.style.display = "block";
});
spanClose.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Overlay inicial
const tapOverlay = document.getElementById("tapToStart");

tapOverlay.addEventListener("click", async () => {
  if (!isAudioInitialized) {
    await inicializarAudio();
    tapOverlay.classList.add("hidden");
  }
});
