export default class VoxelWorld {
  
  
  constructor(cellSize = 16) {
    this.cellSize = cellSize;
    this.cell = cellSize * cellSize * cellSize;
  }

  
  generateGeometryDataForCell(cellX, cellY, cellZ) {
    const { cellSize } = this;
    const startX = cellX * cellSize;
    const startY = cellY * cellSize;
    const startZ = cellZ * cellSize;

    for (let y = 0; y < cellSize; ++y) {
      const voxelY = startY + y;
      for (let z = 0; z < cellSize; ++z) {
        const voxelZ = startZ + z;
        for (let x = 0; x < cellSize; ++x) {
          const voxelX = startX + x;
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
          //if there is a voxel there then lets check if we need to get rid of faces
          if (voxel) {
            for (const { dir } of VoxelWorld.faces) {
              //check for 
              const neighbor = getVoxel(
                voxelX + dir[0],
                voxelY + dir[1],
                voxelZ + dir[2]
              );
              if (!neighbor) {
                // this voxel has no neighbor in this direction so we need a face
                // here.
              }
            }
          }
        }
      }
    }
  }
  
  
}

VoxelWorld.faces = [
  { // left
    dir: [ -1,  0,  0, ],
  },
  { // right
    dir: [  1,  0,  0, ],
  },
  { // bottom
    dir: [  0, -1,  0, ],
  },
  { // top
    dir: [  0,  1,  0, ],
  },
  { // back
    dir: [  0,  0, -1, ],
  },
  { // front
    dir: [  0,  0,  1, ],
  },
];