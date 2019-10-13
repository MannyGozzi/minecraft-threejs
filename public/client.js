const renderContainer = document.querySelector('#renderer');
const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

// Create a Camera
const fov = 90; // AKA Field of View
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

// we'll move the camera back a bit so that we can view the scene
camera.position.set( 0, 0, 10 );

const renderer = new THREE.WebGLRenderer({antialias: true, canvas: renderContainer});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

const cube = new THREE.Mesh(new THREE.BoxBufferGeometry( 2, 2, 2 ), new THREE.MeshBasicMaterial());
scene.add(cube);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.Mesh);
scene.add(ground);






render();

function render() {
  renderer.render( scene, camera );  
  mesh.rotation.y += 0.01;
  mesh.rotation.x += 0.01;
  window.requestAnimationFrame(render);
}