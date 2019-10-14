export default function Ground() {
  const texture = new THREE.TextureLoader().load(
    "https://cdn.glitch.com/09b41b8e-5b1b-470e-8b60-eeaccaea49e9%2Fmud_grass_texture.jpg?v=1570931583854"
  );

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })
  );
  ground.rotation.x += Math.PI / 2;
  ground.position.y = 0;
  return ground;
}
