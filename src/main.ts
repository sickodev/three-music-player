import "./style.css";
import * as THREE from "three";
import {
  EffectComposer,
  OrbitControls,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import { spline } from "./spline";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000008, 0.2);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById("app")?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.8;
camera.position.set(0, 0, 5);

//post processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  100
);
bloomPass.threshold = 0.02;
bloomPass.strength = 1;
bloomPass.radius = 0;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// create tube geometry from spline
const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);

const edges = new THREE.EdgesGeometry(tubeGeometry, 0.4);
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xaaaaaa,
});
const tubeLines = new THREE.LineSegments(edges, lineMaterial);
scene.add(tubeLines);

const hemilight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemilight);

//add boxes
const numBoxes = 40;
const size = 0.15;
const boxGeometry = new THREE.BoxGeometry(size, size, size);
const sphereGeometry = new THREE.SphereGeometry(size / 4);
for (let i = 0; i < numBoxes; i += 1) {
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMat);

  const p = (i / numBoxes + Math.random() * 0.1) % 1;
  const pos = tubeGeometry.parameters.path.getPointAt(p);
  pos.x += Math.random() - 0.4;
  pos.z += Math.random() - 0.4;
  const rote = new THREE.Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  const edges = new THREE.EdgesGeometry(boxGeometry, 0.1);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0056ff });
  const boxLines = new THREE.LineSegments(edges, lineMaterial);
  boxLines.rotation.set(rote.x, rote.y, rote.z);
  boxLines.position.copy(pos);
  scene.add(boxLines);

  sphere.rotation.set(rote.x, rote.y, rote.z);
  sphere.position.copy(pos);
  if (Math.random() > 0.5) {
    scene.add(sphere);
  }
}

//camera fly through
function updateCamera(t: number) {
  const time = t * 0.07;
  const looptime = 10 * 1000;
  const p = (time % looptime) / looptime;
  const pos = tubeGeometry.parameters.path.getPointAt(p);
  const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
  camera.position.copy(pos);
  camera.lookAt(lookAt);
}
function animate(t = 0) {
  requestAnimationFrame(animate);
  updateCamera(t);
  // composer.render();
  renderer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", handleWindowResize, false);
