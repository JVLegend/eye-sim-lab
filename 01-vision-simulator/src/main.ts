type Pathology = "normal" | "cataract" | "glaucoma" | "amd" | "dr";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const pathologySel = document.getElementById("pathology") as HTMLSelectElement;
const sevInput = document.getElementById("severity") as HTMLInputElement;
const sevVal = document.getElementById("sev-val") as HTMLSpanElement;
const fileInput = document.getElementById("file") as HTMLInputElement;
const webcamBtn = document.getElementById("webcam") as HTMLButtonElement;

let source: HTMLImageElement | HTMLVideoElement | null = null;
let rafId = 0;

const defaultImage = new Image();
defaultImage.crossOrigin = "anonymous";
defaultImage.src =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=70";
defaultImage.onload = () => { source = defaultImage; render(); };

fileInput.addEventListener("change", () => {
  const f = fileInput.files?.[0];
  if (!f) return;
  const img = new Image();
  img.onload = () => { source = img; render(); };
  img.src = URL.createObjectURL(f);
});

webcamBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    await video.play();
    source = video;
    loop();
  } catch (e) {
    alert("Não foi possível acessar a webcam: " + (e as Error).message);
  }
});

pathologySel.addEventListener("change", render);
sevInput.addEventListener("input", () => {
  sevVal.textContent = sevInput.value;
  render();
});

function loop() {
  render();
  rafId = requestAnimationFrame(loop);
}

function render() {
  if (!source) return;
  const w = canvas.width, h = canvas.height;
  const path = pathologySel.value as Pathology;
  const sev = parseInt(sevInput.value) / 100;

  ctx.save();
  ctx.filter = buildFilter(path, sev);
  const iw = "videoWidth" in source ? source.videoWidth : source.naturalWidth;
  const ih = "videoHeight" in source ? source.videoHeight : source.naturalHeight;
  if (iw && ih) {
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale, dh = ih * scale;
    ctx.drawImage(source, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }
  ctx.restore();

  applyOverlay(path, sev, w, h);
}

function buildFilter(path: Pathology, sev: number): string {
  switch (path) {
    case "cataract":
      return `blur(${sev * 8}px) sepia(${sev * 0.6}) contrast(${1 - sev * 0.3}) brightness(${1 - sev * 0.2})`;
    case "dr":
      return `contrast(${1 - sev * 0.2}) brightness(${1 - sev * 0.15})`;
    case "glaucoma":
    case "amd":
    case "normal":
    default:
      return "none";
  }
}

function applyOverlay(path: Pathology, sev: number, w: number, h: number) {
  if (path === "glaucoma") {
    // Vinheta periférica → perda de campo periférico
    const cx = w / 2, cy = h / 2;
    const innerR = Math.max(40, (1 - sev) * Math.min(w, h) * 0.5);
    const outerR = Math.hypot(w, h) / 2;
    const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.98)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  if (path === "amd") {
    // Escotoma central
    const cx = w / 2, cy = h / 2;
    const r = 20 + sev * Math.min(w, h) * 0.25;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, "rgba(20,20,20,0.98)");
    grad.addColorStop(0.7, "rgba(30,30,30,0.8)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  if (path === "dr") {
    // Manchas escuras dispersas (hemorragias/exsudatos)
    const n = Math.floor(sev * 40);
    ctx.fillStyle = "rgba(20,5,5,0.85)";
    // Deterministic pattern based on severity
    for (let i = 0; i < n; i++) {
      const x = ((i * 9301 + 49297) % 233280) / 233280 * w;
      const y = ((i * 1327 + 71) % 233280) / 233280 * h;
      const r = 4 + ((i * 7) % 12);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Alguns exsudatos amarelados
    ctx.fillStyle = "rgba(210,180,80,0.6)";
    for (let i = 0; i < n / 3; i++) {
      const x = ((i * 4177 + 911) % 233280) / 233280 * w;
      const y = ((i * 2039 + 503) % 233280) / 233280 * h;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
