import PointerLockControls from "/utils/PointerLockControls.js";
import PointLight from "/utils/pointLight.js";
import AmbientLight from "/utils/ambientLight.js";
import { ImprovedNoise } from "/utils/ImprovedNoise.js";
import VoxelWorld from "/utils/voxelWorld.js";
import buildWorld from '/utils/buildWorld.js';
import configCamera from '/utils/configCamera.js';
import configRenderer from '/utils/configRenderer.js';
import attachResizeListener from '/utils/attachResizeListener.js';

const renderContainer = document.querySelector("#renderer");
const scene = new THREE.Scene(); scene.background = new THREE.Color("lightblue");

const camera = configCamera();
const renderer = configRenderer(renderContainer);
const pointLight = PointLight(); scene.add(pointLight);
const ambientLight = AmbientLight(); scene.add(ambientLight);

//VOXEL WORLD CREATION
const {mesh, world}  = buildWorld(); scene.add(mesh);

attachResizeListener(renderer, camera);

//add controls
let pointerLock = new PointerLockControls(camera);
scene.add(pointerLock.controls.getObject());

//add all objects that the player needs to interact with physically
pointerLock.pushIntersectObject(mesh);


render();

function render() {
  renderer.render(scene, camera);
  pointerLock.update(scene);
  window.requestAnimationFrame(render);
}
