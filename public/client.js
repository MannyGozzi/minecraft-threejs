import PointerLockControls from "/utils/PointerLockControls.js";
import Ground from "/utils/ground.js";
import PointLight from "/utils/pointLight.js";
import AmbientLight from "/utils/ambientLight.js";
import { ImprovedNoise } from "/utils/ImprovedNoise.js";
import VoxelWorld from "/utils/voxelWorld.js";
import buildWorld from '/utils/buildWorld.js';
import configCamera from '/utils/configCamera.js';
import configRenderer from '/utils/configRenderer.js';
import attachResizeListener from '/utils/attachResizeListener.js';

const renderContainer = document.querySelector("#renderer");
const scene = new THREE.Scene();
scene.background = new THREE.Color("lightblue");

const camera = configCamera();
const renderer = configRenderer(renderContainer);

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

attachResizeListener(renderer, camera);

//add controls
let pointerLock = new PointerLockControls(camera);
scene.add(pointerLock.controls.getObject());

pointerLock.pushIntersectObject(ground);
pointerLock.pushIntersectObject(mesh);


render();

function render() {
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  pointerLock.update();
  window.requestAnimationFrame(render);
}
