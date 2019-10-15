import PointerLockControls from "/utils/PointerLockControls.js";
import Ground from "/utils/ground.js";
import PointLight from "/utils/pointLight.js";
import AmbientLight from "/utils/ambientLight.js";
import { ImprovedNoise } from "/utils/ImprovedNoise.js";
import VoxelWorld from "/utils/voxelWorld.js";

const renderContainer = document.querySelector("#renderer");
const scene = new THREE.Scene();
scene.background = new THREE.Color("lightblue");

// Create a Camera
const fov = 90; // AKA Field of View
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane
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
const cellSize = 32;
const loader = new THREE.TextureLoader();
  const texture = loader.load('https://cdn.glitch.com/09b41b8e-5b1b-470e-8b60-eeaccaea49e9%2Ftexture_atlas_edited.png?v=1571104174274', render);
texture.encoding = THREE.sRGBEncoding;  
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
mesh.position.y -= cellSize;
mesh.position.x -= cellSize / 2;
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

  const cellIdToMesh = {};
  function updateCellGeometry(x, y, z) {
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    const cellZ = Math.floor(z / cellSize);
    const cellId = world.computeCellId(x, y, z);
    let mesh = cellIdToMesh[cellId];
    if (!mesh) {
      const geometry = new THREE.BufferGeometry();
      const positionNumComponents = 3;
      const normalNumComponents = 3;
      const uvNumComponents = 2;

      geometry.addAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array(0), positionNumComponents));
      geometry.addAttribute(
          'normal',
          new THREE.BufferAttribute(new Float32Array(0), normalNumComponents));
      geometry.addAttribute(
          'uv',
          new THREE.BufferAttribute(new Float32Array(0), uvNumComponents));

      mesh = new THREE.Mesh(geometry, material);
      mesh.name = cellId;
      cellIdToMesh[cellId] = mesh;
      scene.add(mesh);
      mesh.position.set(cellX * cellSize, cellY * cellSize, cellZ * cellSize);
    }

    const {positions, normals, uvs, indices} = world.generateGeometryDataForCell(cellX, cellY, cellZ);
    const geometry = mesh.geometry;
    geometry['position'] = (new Float32Array(positions)).needsUpdate = true;
    geometry['normal'] = (new Float32Array(normals)).needsUpdate = true;
    geometry['uv'] = (new Float32Array(uvs)).needsUpdate = true;
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();
  }

  const neighborOffsets = [
    [ 0,  0,  0], // self
    [-1,  0,  0], // left
    [ 1,  0,  0], // right
    [ 0, -1,  0], // down
    [ 0,  1,  0], // up
    [ 0,  0, -1], // back
    [ 0,  0,  1], // front
  ];
  function updateVoxelGeometry(x, y, z) {
    const updatedCellIds = {};
    for (const offset of neighborOffsets) {
      const ox = x + offset[0];
      const oy = y + offset[1];
      const oz = z + offset[2];
      const cellId = world.computeCellId(ox, oy, oz);
      if (!updatedCellIds[cellId]) {
        updatedCellIds[cellId] = true;
        updateCellGeometry(ox, oy, oz);
      }
    }
  }

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

  updateVoxelGeometry(1, 1, 1);  // 0,0,0 will generate

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let renderRequested = false;

  function render() {
    renderRequested = undefined;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    pointerLock.update();
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  pointerLock.update();
  window.requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }

  let currentVoxel = 0;
  let currentId;

  document.querySelectorAll('#ui .tiles input[type=radio][name=voxel]').forEach((elem) => {
    elem.addEventListener('click', allowUncheck);
  });

  function allowUncheck() {
    if (this.id === currentId) {
      this.checked = false;
      currentId = undefined;
      currentVoxel = 0;
    } else {
      currentId = this.id;
      currentVoxel = parseInt(this.value);
    }
  }

  function getCanvasRelativePosition(event) {
    const rect = renderContainer.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function placeVoxel(event) {
    const pos = getCanvasRelativePosition(event);
    const x = (pos.x / renderContainer.clientWidth ) *  2 - 1;
    const y = (pos.y / renderContainer.clientHeight) * -2 + 1;  // note we flip Y

    const start = new THREE.Vector3();
    const end = new THREE.Vector3();
    start.setFromMatrixPosition(camera.matrixWorld);
    end.set(x, y, 1).unproject(camera);

    const intersection = world.intersectRay(start, end);
    if (intersection) {
      const voxelId = event.shiftKey ? 0 : currentVoxel;
      // the intersection point is on the face. That means
      // the math imprecision could put us on either side of the face.
      // so go half a normal into the voxel if removing (currentVoxel = 0)
      // our out of the voxel if adding (currentVoxel  > 0)
      const pos = intersection.position.map((v, ndx) => {
        return v + intersection.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
      });
      world.setVoxel(...pos, voxelId);
      updateVoxelGeometry(...pos);
      requestRenderIfNotRequested();
    }
  }

  const mouse = {
    x: 0,
    y: 0,
  };

  function recordStartPosition(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.moveX = 0;
    mouse.moveY = 0;
  }
  function recordMovement(event) {
    mouse.moveX += Math.abs(mouse.x - event.clientX);
    mouse.moveY += Math.abs(mouse.y - event.clientY);
  }
  function placeVoxelIfNoMovement(event) {
    if (mouse.moveX < 5 && mouse.moveY < 5) {
      placeVoxel(event);
    }
    window.removeEventListener('mousemove', recordMovement);
    window.removeEventListener('mouseup', placeVoxelIfNoMovement);
  }
  renderContainer.addEventListener('mousedown', (event) => {
    event.preventDefault();
    recordStartPosition(event);
    window.addEventListener('mousemove', recordMovement);
    window.addEventListener('mouseup', placeVoxelIfNoMovement);
  }, {passive: false});
  renderContainer.addEventListener('touchstart', (event) => {
    event.preventDefault();
    recordStartPosition(event.touches[0]);
  }, {passive: false});
  renderContainer.addEventListener('touchmove', (event) => {
    event.preventDefault();
    recordMovement(event.touches[0]);
  }, {passive: false});
  renderContainer.addEventListener('touchend', () => {
    placeVoxelIfNoMovement({
      clientX: mouse.x,
      clientY: mouse.y,
    });
  });

  renderContainer.addEventListener('change', requestRenderIfNotRequested);
  window.addEventListener('resize', requestRenderIfNotRequested);

render();
