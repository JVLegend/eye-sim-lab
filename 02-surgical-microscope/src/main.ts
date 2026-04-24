import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050608);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Lights — microscope ring light
const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(0, 0, 5);
scene.add(keyLight);
scene.add(new THREE.AmbientLight(0x333344, 0.5));
const rim = new THREE.PointLight(0x88aaff, 0.6, 10);
rim.position.set(2, 2, 3);
scene.add(rim);

// ============================================================
// Eye anatomy (segmento anterior em foco)
// ============================================================
const eye = new THREE.Group();
scene.add(eye);

// Sclera (esfera opaca)
const sclera = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshStandardMaterial({ color: 0xf0ebe0, roughness: 0.7 })
);
eye.add(sclera);

// Iris (anel colorido)
const iris = new THREE.Mesh(
  new THREE.RingGeometry(0.18, 0.55, 64),
  new THREE.MeshStandardMaterial({ color: 0x6b8e9f, side: THREE.DoubleSide, roughness: 0.3 })
);
iris.position.z = 0.85;
eye.add(iris);

// Pupila (disco preto)
const pupil = new THREE.Mesh(
  new THREE.CircleGeometry(0.18, 64),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
pupil.position.z = 0.86;
eye.add(pupil);

// Córnea (cúpula translúcida na frente)
const cornea = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2.4),
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transparent: true, opacity: 0.25,
    transmission: 0.9, roughness: 0.05, thickness: 0.1, ior: 1.376,
  })
);
cornea.rotation.x = -Math.PI / 2;
cornea.position.z = 0.55;
eye.add(cornea);

// ============================================================
// Cristalino — 12 fragmentos (emulando divisão pré-faco)
// ============================================================
const lensGroup = new THREE.Group();
lensGroup.position.z = 0.75;
eye.add(lensGroup);

const fragments: THREE.Mesh[] = [];
const FRAG_COUNT = 12;
const lensMat = new THREE.MeshPhysicalMaterial({
  color: 0xfff4d6, transparent: true, opacity: 0.55,
  transmission: 0.6, roughness: 0.15, thickness: 0.2, ior: 1.41,
});
for (let i = 0; i < FRAG_COUNT; i++) {
  const a0 = (i / FRAG_COUNT) * Math.PI * 2;
  const a1 = ((i + 1) / FRAG_COUNT) * Math.PI * 2;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  const r = 0.17;
  const steps = 8;
  for (let s = 0; s <= steps; s++) {
    const a = a0 + (a1 - a0) * (s / steps);
    shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  shape.lineTo(0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 });
  const frag = new THREE.Mesh(geo, lensMat);
  frag.userData.removed = false;
  frag.userData.index = i;
  lensGroup.add(frag);
  fragments.push(frag);
}

// ============================================================
// Ponteira de faco (cilindro na ponta do mouse)
// ============================================================
const probe = new THREE.Group();
const probeShaft = new THREE.Mesh(
  new THREE.CylinderGeometry(0.015, 0.015, 1.2, 16),
  new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 })
);
probeShaft.position.y = 0.6;
const probeTip = new THREE.Mesh(
  new THREE.ConeGeometry(0.015, 0.05, 16),
  new THREE.MeshStandardMaterial({ color: 0xffcc66, emissive: 0x442200 })
);
probeTip.position.y = 0.025;
probeTip.rotation.x = Math.PI;
probe.add(probeShaft, probeTip);
probe.rotation.x = Math.PI / 2.5;
probe.visible = false;
scene.add(probe);

// ============================================================
// Controles — órbita simples
// ============================================================
let isDragging = false, lastX = 0, lastY = 0;
let yaw = 0, pitch = 0, dist = 3;

renderer.domElement.addEventListener("pointerdown", (e) => {
  isDragging = true; lastX = e.clientX; lastY = e.clientY;
});
window.addEventListener("pointerup", () => { isDragging = false; });
window.addEventListener("pointermove", (e) => {
  if (isDragging) {
    yaw += (e.clientX - lastX) * 0.005;
    pitch += (e.clientY - lastY) * 0.005;
    pitch = Math.max(-1.2, Math.min(1.2, pitch));
    lastX = e.clientX; lastY = e.clientY;
  }
  updateProbe(e.clientX, e.clientY);
});
renderer.domElement.addEventListener("wheel", (e) => {
  e.preventDefault();
  dist *= 1 + e.deltaY * 0.001;
  dist = Math.max(1.3, Math.min(6, dist));
}, { passive: false });

// Click na pupila → remover fragmento mais próximo
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
renderer.domElement.addEventListener("click", (e) => {
  ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
  ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(fragments.filter(f => !f.userData.removed));
  if (hits.length) {
    const f = hits[0].object as THREE.Mesh;
    f.userData.removed = true;
    animateRemove(f);
  }
});

function updateProbe(x: number, y: number) {
  ndc.x = (x / window.innerWidth) * 2 - 1;
  ndc.y = -(y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const pos = new THREE.Vector3();
  raycaster.ray.at(dist * 0.8, pos);
  probe.position.copy(pos);
  probe.visible = true;
}

function animateRemove(f: THREE.Mesh) {
  const start = performance.now();
  const startPos = f.position.clone();
  const dir = new THREE.Vector3().copy(f.position).normalize().add(new THREE.Vector3(0, 0, 1));
  (function tick() {
    const t = Math.min(1, (performance.now() - start) / 500);
    f.position.copy(startPos).addScaledVector(dir, t * 1.2);
    (f.material as THREE.MeshPhysicalMaterial).opacity = 0.55 * (1 - t);
    f.scale.setScalar(1 - t * 0.5);
    if (t < 1) requestAnimationFrame(tick);
    else { f.visible = false; updateFragCount(); }
  })();
}

function updateFragCount() {
  const removed = fragments.filter(f => f.userData.removed).length;
  (document.getElementById("frags") as HTMLSpanElement).textContent = String(removed);
}

// Reset
window.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") reset();
});
function reset() {
  fragments.forEach((f, i) => {
    f.userData.removed = false;
    f.visible = true;
    f.position.set(0, 0, 0);
    f.scale.setScalar(1);
    (f.material as THREE.MeshPhysicalMaterial).opacity = 0.55;
  });
  updateFragCount();
}

// ============================================================
// Loop
// ============================================================
function animate() {
  requestAnimationFrame(animate);
  const x = Math.sin(yaw) * Math.cos(pitch) * dist;
  const y = Math.sin(pitch) * dist;
  const z = Math.cos(yaw) * Math.cos(pitch) * dist;
  camera.position.set(x, y, z);
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
