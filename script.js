/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const WEDDING_ISO = "2026-06-20T12:00:00+01:00";
const ADDRESS_TEXT = "Quinta do Pateo, Dois Portos - Torres Vedras";

// velocidade do marquee (px por frame)
const MARQUEE_SPEED = 0.55;


/* =========================================================
   COUNTDOWN
========================================================= */

const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");

function pad2(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  const target = new Date(WEDDING_ISO).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    cdDays.textContent = "0";
    cdHours.textContent = "00";
    cdMinutes.textContent = "00";
    cdSeconds.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  cdDays.textContent = String(days);
  cdHours.textContent = pad2(hours);
  cdMinutes.textContent = pad2(minutes);
  cdSeconds.textContent = pad2(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================================================
   MARQUEE HERO (movimento contínuo)
========================================================= */

const track = document.getElementById("marqueeTrack");
let offset = 0;

if (track) {
  // duplicar conteúdo para loop infinito
  track.innerHTML += track.innerHTML;

  function animateMarquee() {
    offset -= MARQUEE_SPEED;

    // quando passa metade, reinicia sem salto
    if (Math.abs(offset) >= track.scrollWidth / 2) {
      offset = 0;
    }

    track.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(animateMarquee);
  }

  animateMarquee();
}


/* =========================================================
   COPIAR MORADA
========================================================= */

const copyBtn = document.getElementById("copyAddress");
const copyHint = document.getElementById("copyHint");

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS_TEXT);
      if (copyHint) copyHint.textContent = "Morada copiada ✅";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = ADDRESS_TEXT;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      if (copyHint) copyHint.textContent = "Morada copiada ✅";
    }

    setTimeout(() => {
      if (copyHint) copyHint.textContent = "";
    }, 2500);
  });
}


/* =========================================================
   INTRO ENVELOPE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const openInvite = document.getElementById("openInvite");
  const introOverlay = document.getElementById("introOverlay");
  const envelope = document.querySelector(".envelope");

  // segurança: começa “locked”
  document.body.classList.remove("invite-open");
  document.body.style.overflow = "hidden";

  if (!openInvite || !introOverlay || !envelope) {
    // se faltar algo, não bloquear o site
    document.body.classList.add("invite-open");
    document.body.style.overflow = "auto";
    return;
  }

  let opened = false;

  openInvite.addEventListener("click", () => {
    if (opened) return;
    opened = true;

    envelope.classList.add("open");
    openInvite.disabled = true;

    // timing alinhado com flap + glow
    window.setTimeout(() => {
      introOverlay.classList.add("is-hidden");
      document.body.classList.add("invite-open");
      document.body.style.overflow = "auto";

      // foco para acessibilidade
      const main = document.getElementById("conteudo");
      if (main) main.focus({ preventScroll: true });
    }, 1200);
  });
});
