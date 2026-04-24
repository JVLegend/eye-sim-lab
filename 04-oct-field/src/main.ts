import { drawOct, type OctPath } from "./oct";
import { drawVf, type VfPath } from "./vf";

const octCanvas = document.getElementById("oct") as HTMLCanvasElement;
const vfSvg = document.getElementById("vf") as unknown as SVGSVGElement;
const octPath = document.getElementById("octPath") as HTMLSelectElement;
const octSev = document.getElementById("octSev") as HTMLInputElement;
const octSevVal = document.getElementById("octSevVal")!;
const vfPath = document.getElementById("vfPath") as HTMLSelectElement;
const vfSev = document.getElementById("vfSev") as HTMLInputElement;
const vfSevVal = document.getElementById("vfSevVal")!;
const dl = document.getElementById("download") as HTMLButtonElement;

function renderAll() {
  octSevVal.textContent = octSev.value;
  vfSevVal.textContent = vfSev.value;
  drawOct(octCanvas, octPath.value as OctPath, parseInt(octSev.value));
  drawVf(vfSvg, vfPath.value as VfPath, parseInt(vfSev.value));
}

[octPath, octSev, vfPath, vfSev].forEach(el => el.addEventListener("input", renderAll));

dl.addEventListener("click", () => {
  // OCT PNG
  const a = document.createElement("a");
  a.href = octCanvas.toDataURL("image/png");
  a.download = `oct_${octPath.value}_${octSev.value}.png`;
  a.click();
  // VF via SVG → canvas
  const svgData = new XMLSerializer().serializeToString(vfSvg);
  const img = new Image();
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = 420; c.height = 400;
    const cx = c.getContext("2d")!;
    cx.fillStyle = "#fff"; cx.fillRect(0, 0, 420, 400);
    cx.drawImage(img, 0, 0);
    const a2 = document.createElement("a");
    a2.href = c.toDataURL("image/png");
    a2.download = `vf_${vfPath.value}_${vfSev.value}.png`;
    a2.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
});

renderAll();
