const renderContainer = document.querySelector('#renderer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);

// Create a Camera
const fov = 90; // AKA Field of View
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

// we'll move the camera back a bit so that we can view the scene
camera.position.set( 0, 0, 10 );

const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({antialias: true, canvas: renderContainer});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

render();

function render() {
  renderer.render( scene, camera );  
  mesh.rotation.y += 0.01;
  mesh.rotation.x += 0.01;
  window.requestAnimationFrame(render);
}