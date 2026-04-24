export type OctPath = "normal" | "edema" | "hole" | "detach";

export function drawOct(canvas: HTMLCanvasElement, path: OctPath, sev: number) {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  // Camadas retinianas — faixas horizontais onduladas (fóvea = depressão central)
  const layers = [
    { y: 70, color: "#d0e4ff", t: 3, name: "NFL" },
    { y: 85, color: "#a6c8ff", t: 3, name: "GCL" },
    { y: 100, color: "#7aa8e0", t: 4, name: "IPL" },
    { y: 118, color: "#5688c0", t: 5, name: "INL" },
    { y: 135, color: "#3e6fa0", t: 4, name: "OPL" },
    { y: 152, color: "#2a5580", t: 8, name: "ONL" },
    { y: 175, color: "#ffcc66", t: 2, name: "ELM" },
    { y: 183, color: "#ffe699", t: 3, name: "EZ" },
    { y: 195, color: "#ff9966", t: 2, name: "RPE" },
  ];

  // Fóvea dip
  const foveaX = w / 2;
  const foveaDepth = 22;
  const foveaWidth = 60;
  const foveaY = (x: number) => {
    const d = Math.abs(x - foveaX);
    if (d > foveaWidth) return 0;
    return -foveaDepth * Math.cos((d / foveaWidth) * Math.PI / 2);
  };

  for (const L of layers) {
    ctx.fillStyle = L.color;
    ctx.beginPath();
    ctx.moveTo(0, L.y);
    for (let x = 0; x <= w; x += 2) {
      const noise = (Math.sin(x * 0.05) + Math.sin(x * 0.13)) * 0.8;
      // Fóvea afeta só as camadas superiores
      const dip = L.y < 170 ? foveaY(x) : 0;
      ctx.lineTo(x, L.y + noise - dip);
    }
    for (let x = w; x >= 0; x -= 2) {
      const noise = (Math.sin(x * 0.05) + Math.sin(x * 0.13)) * 0.8;
      const dip = L.y < 170 ? foveaY(x) : 0;
      ctx.lineTo(x, L.y + L.t + noise - dip);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Sobreposição de patologia
  if (path === "edema") {
    // Cistos intra-retinianos (elipses escuras na INL/OPL)
    const s = sev / 100;
    ctx.fillStyle = "#000";
    const nCysts = Math.floor(3 + s * 6);
    for (let i = 0; i < nCysts; i++) {
      const cx = foveaX + (i - nCysts / 2) * 22 + ((i * 31) % 12 - 6);
      const cy = 130;
      const rx = 8 + s * 10;
      const ry = 6 + s * 12;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (path === "hole") {
    // Descontinuidade na fóvea — buraco de espessura total
    const s = sev / 100;
    const holeW = 15 + s * 35;
    ctx.fillStyle = "#000";
    ctx.fillRect(foveaX - holeW / 2, 60, holeW, 130);
    // Bordas elevadas (cisto peri-buraco)
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath(); ctx.ellipse(foveaX - holeW / 2, 95, 8, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(foveaX + holeW / 2, 95, 8, 12, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (path === "detach") {
    // Fluido subretiniano — separação entre ONL e EPR
    const s = sev / 100;
    const domeW = 120 + s * 150;
    const domeH = 10 + s * 35;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(foveaX - domeW / 2, 195);
    ctx.quadraticCurveTo(foveaX, 195 - domeH * 2, foveaX + domeW / 2, 195);
    ctx.fill();
  }

  // Legenda
  ctx.fillStyle = "#8b949e";
  ctx.font = "11px system-ui";
  ctx.fillText("nasal", 8, h - 8);
  ctx.fillText("temporal", w - 54, h - 8);
  ctx.fillText("OCT B-scan 6mm (sintético)", 8, 16);
}
