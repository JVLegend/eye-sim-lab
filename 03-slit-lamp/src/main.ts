import { CASES, type Case, type Finding } from "./cases";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const caseSel = document.getElementById("caseSel") as HTMLSelectElement;
const widthIn = document.getElementById("width") as HTMLInputElement;
const angleIn = document.getElementById("angle") as HTMLInputElement;
const intIn = document.getElementById("intensity") as HTMLInputElement;
const magIn = document.getElementById("mag") as HTMLInputElement;
const wVal = document.getElementById("w-val")!;
const aVal = document.getElementById("a-val")!;
const iVal = document.getElementById("i-val")!;
const mVal = document.getElementById("m-val")!;
const optionsEl = document.getElementById("options")!;
const feedback = document.getElementById("feedback") as HTMLParagraphElement;

CASES.forEach((c, i) => {
  const opt = document.createElement("option");
  opt.value = String(i); opt.textContent = c.name;
  caseSel.appendChild(opt);
});

let current: Case = CASES[0];
let answered = false;

caseSel.addEventListener("change", () => {
  current = CASES[parseInt(caseSel.value)];
  answered = false;
  feedback.textContent = "";
  feedback.className = "feedback";
  buildOptions();
  render();
});

[widthIn, angleIn, intIn, magIn].forEach(el => el.addEventListener("input", () => {
  wVal.textContent = widthIn.value;
  aVal.textContent = angleIn.value;
  iVal.textContent = intIn.value;
  mVal.textContent = magIn.value;
  render();
}));

function buildOptions() {
  optionsEl.innerHTML = "";
  current.options.forEach(o => {
    const b = document.createElement("button");
    b.textContent = o.label;
    b.onclick = () => answer(o.id);
    optionsEl.appendChild(b);
  });
}

function answer(f: Finding) {
  if (answered) return;
  answered = true;
  if (f === current.finding) {
    feedback.textContent = "✓ Correto. " + current.summary;
    feedback.className = "feedback ok";
  } else {
    feedback.textContent = "✗ Incorreto. " + current.summary;
    feedback.className = "feedback err";
  }
}

function render() {
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2;
  const mag = parseInt(magIn.value) / 10;
  const beamW = parseInt(widthIn.value) / 100 * 260 * mag;
  const beamA = parseInt(angleIn.value) * Math.PI / 180;
  const intensity = parseInt(intIn.value) / 100;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  // Vinheta do microscópio (view circular)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(w, h) * 0.45, 0, Math.PI * 2);
  ctx.clip();

  // Olho — esclera de fundo
  ctx.fillStyle = "#2a1c18";
  ctx.fillRect(0, 0, w, h);
  const scleraR = 180 * mag;
  const g = ctx.createRadialGradient(cx, cy, scleraR * 0.2, cx, cy, scleraR);
  g.addColorStop(0, "#f5e6d3");
  g.addColorStop(1, "#c9a896");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, scleraR * 1.3, scleraR * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();

  // Córnea (anel sutil)
  ctx.strokeStyle = "rgba(150,180,200,0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, 90 * mag, 0, Math.PI * 2); ctx.stroke();

  // Íris
  const irisR = 78 * mag;
  const irisGrad = ctx.createRadialGradient(cx, cy, 20 * mag, cx, cy, irisR);
  irisGrad.addColorStop(0, "#5c7a8f");
  irisGrad.addColorStop(1, "#2b4054");
  ctx.fillStyle = irisGrad;
  ctx.beginPath(); ctx.arc(cx, cy, irisR, 0, Math.PI * 2); ctx.fill();

  // Textura da íris
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 22 * mag, cy + Math.sin(a) * 22 * mag);
    ctx.lineTo(cx + Math.cos(a) * irisR, cy + Math.sin(a) * irisR);
    ctx.stroke();
  }

  // Pupila — formato depende do achado (sinéquia deforma)
  drawPupil(cx, cy, 22 * mag, current.finding);

  // Achado-específico (desenhado no olho antes do feixe)
  drawFinding(cx, cy, mag, current.finding, intensity);

  // Feixe de luz
  drawBeam(cx, cy, beamW, beamA, intensity);

  ctx.restore();

  // HUD do microscópio
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * 0.45, 0, Math.PI * 2); ctx.stroke();
}

function drawPupil(cx: number, cy: number, r: number, f: Finding) {
  ctx.fillStyle = "#000";
  if (f === "synechia") {
    // Pupila irregular com "pontas" de sinéquia
    ctx.beginPath();
    const pts = 12;
    for (let i = 0; i < pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const rr = r * (i % 3 === 0 ? 0.7 : 1);
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  }
}

function drawFinding(cx: number, cy: number, mag: number, f: Finding, intensity: number) {
  if (f === "tyndall") {
    // Partículas flutuantes na câmara anterior (no feixe)
    ctx.fillStyle = `rgba(255,255,220,${0.6 * intensity})`;
    for (let i = 0; i < 40; i++) {
      const x = cx + ((i * 9301 + 49297) % 140) - 70;
      const y = cy + ((i * 1327 + 71) % 140) - 70;
      ctx.beginPath(); ctx.arc(x, y, 1 + (i % 3) * 0.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (f === "corneal_edema") {
    // Névoa azulada sobre a córnea
    ctx.fillStyle = `rgba(180,210,230,${0.35 * intensity})`;
    ctx.beginPath(); ctx.arc(cx, cy, 90 * mag, 0, Math.PI * 2); ctx.fill();
    // Microcistos epiteliais
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (let i = 0; i < 25; i++) {
      const a = (i / 25) * Math.PI * 2;
      const rr = 30 * mag + (i % 4) * 12 * mag;
      const x = cx + Math.cos(a * 3) * rr;
      const y = cy + Math.sin(a * 3) * rr;
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (f === "synechia") {
    // Linhas radiais da íris ao cristalino (aderências)
    ctx.strokeStyle = "rgba(80,40,30,0.85)";
    ctx.lineWidth = 2;
    [0.4, 1.8, 3.5, 5.1].forEach(a => {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 22 * mag, cy + Math.sin(a) * 22 * mag);
      ctx.lineTo(cx + Math.cos(a) * 15 * mag, cy + Math.sin(a) * 15 * mag);
      ctx.stroke();
    });
  }
}

function drawBeam(cx: number, cy: number, w: number, angle: number, intensity: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  const grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  grad.addColorStop(0, `rgba(255,255,230,0)`);
  grad.addColorStop(0.5, `rgba(255,255,230,${0.7 * intensity})`);
  grad.addColorStop(1, `rgba(255,255,230,0)`);
  ctx.fillStyle = grad;
  ctx.globalCompositeOperation = "lighter";
  ctx.fillRect(-w / 2, -400, w, 800);
  ctx.restore();
}

buildOptions();
render();
