export default function Ground() {
  const texture = new THREE.TextureLoader().load(
    "https://cdn.glitch.com/09b41b8e-5b1b-470e-8b60-eeaccaea49e9%2Fbrown_mud_02_diff_1k.jpg?v=1571030008573"
 );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.offset.set( 0, 0 );
  texture.repeat.set( 4, 4 );   //how often to wrap texture

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })
  );
  ground.rotation.x += Math.PI / 2;
  ground.position.y = 0;
  return ground;
}
