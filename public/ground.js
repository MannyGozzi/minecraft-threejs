export default function Ground() {
  const texture = new THREE.TextureLoader().load(
    "https://cdn.glitch.com/09b41b8e-5b1b-470e-8b60-eeaccaea49e9%2Fcobblestone_large_01_diff_2k.jpg?v=1571029319109"
 );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.offset.set( 0, 0 );
  texture.repeat.set( 2, 2 );

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })
  );
  ground.rotation.x += Math.PI / 2;
  ground.position.y = 0;
  return ground;
}
