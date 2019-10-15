import PointerLockControls from '/utils/PointerLockControls.js';
import Ground from '/utils/ground.js';
import PointLight from '/utils/pointLight.js';
import AmbientLight from '/utils/ambientLight.js';
import { ImprovedNoise } from '/utils/ImprovedNoise.js';
import VoxelWorld from '/utils/voxelWorld.js';

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
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.8, 0.8, 0.8),
  new THREE.MeshLambertMaterial()
);
cube.position.y += 0.7;
scene.add(cube);

//add 3d elements to the world
const ground = Grount();
scene.add(ground);
const pointLight = PointLight();
scene.add(pointLight);
const ambientLight = AmbientLight();
scene.add(ambientLight);

//VOXEL WORLD CREATION
  const cellSize = 32;
const loader = new THREE.TextureLoader();
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/minecraft/flourish-cc-by-nc-sa.png', render);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const tileSize = 16;
  const tileTextureWidth = 256;
  const tileTextureHeight = 64;
  const world = new VoxelWorld({
    cellSize,
    tileSize,
    tileTextureWidth,
    tileTextureHeight,
  });

  for (let y = 0; y < cellSize; ++y) {
    for (let z = 0; z < cellSize; ++z) {
      for (let x = 0; x < cellSize; ++x) {
        const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
        if (y < height) {
          world.setVoxel(x, y, z, randInt(1, 17));
        }
      }
    }
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const {positions, normals, uvs, indices} = world.generateGeometryDataForCell(0, 0, 0);
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.1,
    transparent: true,
  });

  const positionNumComponents = 3;
  const normalNumComponents = 3;
  const uvNumComponents = 2;
  geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
  geometry.addAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
  geometry.addAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
  geometry.setIndex(indices);
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y -= cellSize*2;
mesh.position.x -= cellSize/2;
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


render();

function render() {
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  pointerLock.update();
  window.requestAnimationFrame(render);
}
