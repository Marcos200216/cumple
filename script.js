const btn = document.getElementById("btnCorte");
const motoImg = document.querySelector(".moto-img");

let audioCtx;
let bufferSourceArranque;
let bufferSourceCorte;
let corteGainNode;
let arranqueGainNode;
let corteBuffer;
let isArranqueIniciado = false;

// Reproducir sonido de arranque en loop perfecto
async function reproducirArranqueLoop() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const response = await fetch("arranque.mp3");
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  bufferSourceArranque = audioCtx.createBufferSource();
  bufferSourceArranque.buffer = audioBuffer;
  bufferSourceArranque.loop = true;

  arranqueGainNode = audioCtx.createGain();
  arranqueGainNode.gain.value = 0.6; // volumen bajo

  bufferSourceArranque.connect(arranqueGainNode).connect(audioCtx.destination);
  bufferSourceArranque.start(0);
}

// Cargar el sonido de corte y preparar el buffer
async function cargarCorte() {
  const response = await fetch("corte.mp3");
  const arrayBuffer = await response.arrayBuffer();
  corteBuffer = await audioCtx.decodeAudioData(arrayBuffer);
}

// Reproducir sonido de corte con loop mientras se presiona
function reproducirCorteLoop() {
  if (!corteBuffer || !audioCtx) return;

  // Detener si hay un sonido anterior en reproducción
  if (bufferSourceCorte) {
    bufferSourceCorte.stop(0);
    bufferSourceCorte.disconnect();
    bufferSourceCorte = null;
  }

  bufferSourceCorte = audioCtx.createBufferSource();
  bufferSourceCorte.buffer = corteBuffer;
  bufferSourceCorte.loop = true;

  corteGainNode = audioCtx.createGain();
  corteGainNode.gain.value = 1.0; // volumen más alto

  bufferSourceCorte.connect(corteGainNode).connect(audioCtx.destination);
  bufferSourceCorte.start(0);
}

// Detener el sonido de corte
function detenerCorteLoop() {
  if (bufferSourceCorte) {
    bufferSourceCorte.stop(0);
    bufferSourceCorte.disconnect();
    bufferSourceCorte = null;
  }
}

// Función para iniciar el sonido y animación al presionar
function startCorte() {
  reproducirCorteLoop();
  motoImg.classList.add("vibrando");
  document.body.classList.add("fondo-activo");
}

// Función para detener sonido, animación y fondo
function stopCorte() {
  detenerCorteLoop();
  motoImg.classList.remove("vibrando");
  document.body.classList.remove("fondo-activo");
}

// Eventos mouse
btn.addEventListener("mousedown", startCorte);
btn.addEventListener("mouseup", stopCorte);
btn.addEventListener("mouseleave", stopCorte);

// Eventos touch (móvil)
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

// Overlay inicial para iniciar sonido sin cortes
const tapOverlay = document.getElementById("tapToStart");

tapOverlay.addEventListener("click", async () => {
  if (!isArranqueIniciado) {
    await reproducirArranqueLoop();
    await cargarCorte();
    isArranqueIniciado = true;
    tapOverlay.classList.add("hidden");
  }
});
