import PointerLockControls from '/PointerLockControls.js';
import Ground from '/ground.js';
import PointLight from '/pointLight.js';
import AmbientLight from '/ambientLight.js';

const renderContainer = document.querySelector("#renderer");
const scene = new THREE.Scene();
scene.background = new THREE.Color("skyblue");
//TODO character moves without pressing button

// Create a Camera
const fov = 90; // AKA Field of View
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// we'll move the camera back a bit so that we can view the scene
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: renderContainer
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(2, 2, 2),
  new THREE.MeshLambertMaterial()
);
cube.position.y += 1;
scene.add(cube);

const ground = Ground();
scene.add(ground);
const pointLight = PointLight();
scene.add(pointLight);
const ambientLight = AmbientLight();
scene.add(ambientLight);

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

render();

function render() {
  renderer.render(scene, camera);
  pointerLock.update();
  window.requestAnimationFrame(render);
}
