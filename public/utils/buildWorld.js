import VoxelWorld from '/utils/voxelWorld.js';

export default function buildWorld() {
  const cellSize = 16;
  const loader = new THREE.TextureLoader();
  const texture = loader.load("https://cdn.glitch.com/09b41b8e-5b1b-470e-8b60-eeaccaea49e9%2Ftexture_atlas_edited.png?v=1571104174274");
  texture.encoding = THREE.sRGBEncoding;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const tileSize = 64;                            //height/width of each voxel face
  const tileTextureWidth = 256;        //entire atlas texture width
  const tileTextureHeight = 64;
  const world = new VoxelWorld({ 
    cellSize,
    tileSize,
    tileTextureWidth,
    tileTextureHeight
  });

  //populate the world with voxels
  for (let y = 0; y < cellSize; ++y) {
    for (let z = 0; z < cellSize; ++z) {
      for (let x = 0; x < cellSize; ++x) {
        const height =
          (Math.sin((x / cellSize) * Math.PI * 2) +
            Math.sin((z / cellSize) * Math.PI * 3)) *
            (cellSize / 6) +
          cellSize / 2;
        if (y < height) {
          world.setVoxel(x, y, z, randInt(1, 17));
        }
      }
    }
  }

  //generate a random number, the number in this case is used as a reference to the type of texture on the atlas
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  //generate the data for one cell
  const { positions, normals, uvs, indices } = world.generateGeometryDataForCell( 0, 0, 0); 
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
    alphaTest: 0.1,
    transparent: true
  });

  const positionNumComponents = 3;  //each vertex has 3 components (x, y, z)
  const normalNumComponents = 3;    //each normal has 3 components (x, y, z) that gives direction to the face
  const uvNumComponents = 2;            //each point has a uv coordinate, a uv coordinate has 2 components (u, v) to map points on the texture
  geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
  geometry.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
  geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
  geometry.setIndex(indices);
  const mesh = new THREE.Mesh(geometry, material);
  return {world: world, mesh: mesh};
}