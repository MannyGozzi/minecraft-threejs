import PointerLockControls from '/PointerLockControls.js';
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
  new THREE.MeshBasicMaterial()
);
cube.position.y += 2;
scene.add(cube);

var texture = new THREE.TextureLoader().load(
  "https://cdn.glitch.com/09b41b8e-5b1b-470e-8b60-eeaccaea49e9%2Fmud_grass_texture.jpg?v=1570931583854"
);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })
);
ground.rotation.x += Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  //update camera frustum
  camera.updateProjectionMatrix();
});

let pointerLock = new PointerLockControls(camera);
scene.add(pointerLock.getObject());

render();

function render() {
  renderer.render(scene, camera);
  cube.rotation.y += 0.01;
  cube.rotation.x += 0.01;

  pointerLock.update();
  window.requestAnimationFrame(render);
}
