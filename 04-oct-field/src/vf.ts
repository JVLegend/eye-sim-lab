export type VfPath = "normal" | "arcuate" | "altitudinal" | "general" | "bitemporal";

// 24-2 pattern: 54 pontos em grid com coordenadas em graus
const POINTS_24_2: { x: number; y: number }[] = (() => {
  const pts: { x: number; y: number }[] = [];
  // Grade -27..+27 step 6, com limite aproximado de raio 27
  for (let y = 21; y >= -21; y -= 6) {
    for (let x = -27; x <= 27; x += 6) {
      const ay = Math.abs(y), ax = Math.abs(x);
      if (ay > 15 && ax > 21) continue; // cantos
      if (ay > 21) continue;
      pts.push({ x, y });
    }
  }
  return pts;
})();

export function drawVf(svg: SVGSVGElement, path: VfPath, sev: number) {
  const s = sev / 100;
  const cx = 210, cy = 200, scale = 6.5; // px por grau
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // Eixos
  const ns = "http://www.w3.org/2000/svg";
  const axes = (x1: number, y1: number, x2: number, y2: number) => {
    const l = document.createElementNS(ns, "line");
    l.setAttribute("x1", String(x1)); l.setAttribute("y1", String(y1));
    l.setAttribute("x2", String(x2)); l.setAttribute("y2", String(y2));
    l.setAttribute("stroke", "#ccc"); l.setAttribute("stroke-width", "1");
    svg.appendChild(l);
  };
  axes(cx - 180, cy, cx + 180, cy);
  axes(cx, cy - 150, cx, cy + 150);

  // Mancha cega (~15° temporal, 3° abaixo) — assume OD
  const bs = document.createElementNS(ns, "circle");
  bs.setAttribute("cx", String(cx + 15 * scale));
  bs.setAttribute("cy", String(cy + 3 * scale));
  bs.setAttribute("r", "10");
  bs.setAttribute("fill", "#222");
  svg.appendChild(bs);

  for (const p of POINTS_24_2) {
    const px = cx + p.x * scale;
    const py = cy - p.y * scale; // y invertido (cima é positivo)
    const defect = computeDefect(p.x, p.y, path, s);
    const db = Math.max(0, 30 - defect * 30); // 30 dB normal → 0 dB defeito total
    const color = dbToColor(db);
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", String(px)); c.setAttribute("cy", String(py));
    c.setAttribute("r", "11"); c.setAttribute("fill", color);
    c.setAttribute("stroke", "#888"); c.setAttribute("stroke-width", "0.5");
    svg.appendChild(c);
    const t = document.createElementNS(ns, "text");
    t.setAttribute("x", String(px)); t.setAttribute("y", String(py + 3));
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "9");
    t.setAttribute("fill", db > 15 ? "#000" : "#fff");
    t.setAttribute("font-family", "monospace");
    t.textContent = String(Math.round(db));
    svg.appendChild(t);
  }

  // Título
  const title = document.createElementNS(ns, "text");
  title.setAttribute("x", "10"); title.setAttribute("y", "20");
  title.setAttribute("font-size", "12"); title.setAttribute("fill", "#333");
  title.textContent = `24-2 threshold (dB) — ${path} (OD, sintético)`;
  svg.appendChild(title);
}

function computeDefect(x: number, y: number, path: VfPath, s: number): number {
  // Retorna 0..1 onde 1 = defeito completo
  switch (path) {
    case "normal":
      return 0;
    case "arcuate":
      // Feixe arqueado superior nasal (Bjerrum)
      if (y > 2 && y < 18 && x < 10) {
        const dist = Math.abs(y - 10) + Math.max(0, x + 5) * 0.4;
        return Math.max(0, s * (1 - dist / 15));
      }
      return 0;
    case "altitudinal":
      // Metade inferior afetada
      return y < 0 ? s * 0.9 : 0;
    case "general":
      return s * 0.5;
    case "bitemporal":
      // Hemianopsia temporal — assume OD, então lado temporal = x > 0
      return x > 0 ? s * 0.85 : 0;
  }
}

function dbToColor(db: number): string {
  // 30 dB = branco, 0 dB = preto
  const v = Math.round((db / 30) * 255);
  return `rgb(${v},${v},${v})`;
}
