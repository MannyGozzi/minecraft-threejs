import PointerLockControls from "/utils/PointerLockControls.js";
import Ground from "/utils/ground.js";
import PointLight from "/utils/pointLight.js";
import AmbientLight from "/utils/ambientLight.js";
import { ImprovedNoise } from "/utils/ImprovedNoise.js";
import VoxelWorld from "/utils/voxelWorld.js";
import buildWorld from '/utils/buildWorld.js';

const renderContainer = document.querySelector("#renderer");
const scene = new THREE.Scene();
scene.background = new THREE.Color("lightblue");

// Create a Camera
const fov = 90; // AKA Field of View
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; // the near clipping plane
const far = 1000; // the far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// we'll move the camera back a bit so that we can view the scene
camera.position.set(0, 0, 5);

let objects = [];

//initialize the renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: renderContainer
});
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.8, 0.8, 0.8),
  new THREE.MeshLambertMaterial()
);
cube.position.y += 0.7;
scene.add(cube);

//add 3d elements to the world
const ground = Ground();
scene.add(ground);
const pointLight = PointLight();
scene.add(pointLight);
const ambientLight = AmbientLight();
scene.add(ambientLight);

//VOXEL WORLD CREATION
const {mesh, world}  = buildWorld();
mesh.position.y -= 16;
mesh.position.x -= 8;
scene.add(mesh);

//resize canvas if window size is changed
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  //update camera frustum
  camera.updateProjectionMatrix();
});

//add controls
let pointerLock = new PointerLockControls(camera);
scene.add(pointerLock.controls.getObject());

pointerLock.pushIntersectObject(cube);
pointerLock.pushIntersectObject(mesh);
pointerLock.pushIntersectObject(ground);

render();

function render() {
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  pointerLock.update();
  window.requestAnimationFrame(render);
}
