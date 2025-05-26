const audioCorte = document.getElementById("audioCorte");
const audioArranque = document.getElementById("audioArranque");
const btn = document.getElementById("btnCorte");
const motoImg = document.querySelector(".moto-img");

// Sonido de arranque en loop, volumen bajo
window.addEventListener("load", () => {
  audioArranque.volume = 0.3; // más bajo para que no opaque
  audioArranque.loop = true;
  audioArranque.play().catch(() => {
    console.log("Autoplay bloqueado, se iniciará con la primera interacción");
  });
});

// Para desbloquear autoplay con primera interacción
document.body.addEventListener("click", () => {
  if (audioArranque.paused) {
    audioArranque.play();
  }
}, { once: true });

// Función para iniciar el sonido y animación al presionar
function startCorte() {
  audioCorte.play();
  motoImg.classList.add("vibrando");
}

// Función para detener el sonido y animación al soltar
function stopCorte() {
  audioCorte.pause();
  audioCorte.currentTime = 0;
  motoImg.classList.remove("vibrando");
}

// Eventos mouse
btn.addEventListener("mousedown", startCorte);
btn.addEventListener("mouseup", stopCorte);
btn.addEventListener("mouseleave", stopCorte); // por si sale del botón

// Eventos touch (móvil)
btn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startCorte();
});

btn.addEventListener("touchend", stopCorte);
btn.addEventListener("touchcancel", stopCorte);
// Función para iniciar el sonido, animación y fondo
function startCorte() {
  audioCorte.play();
  motoImg.classList.add("vibrando");
  document.body.classList.add("fondo-activo"); // Activar fondo rojo
}

// Función para detener sonido, animación y fondo
function stopCorte() {
  audioCorte.pause();
  audioCorte.currentTime = 0;
  motoImg.classList.remove("vibrando");
  document.body.classList.remove("fondo-activo"); // Restaurar fondo original
}
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
