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
var controls = new THREE.PointerLockControls(camera);
var player = controls.getObject();
scene.add(player);

const cube = new THREE.Mesh(new THREE.BoxBufferGeometry( 2, 2, 2 ), new THREE.MeshBasicMaterial());
scene.add(cube);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({color: 0x00ff22, side: THREE.DoubleSide}));
ground.rotation.x += Math.PI / 2;
ground.position.y -= 2;
scene.add(ground);






render();

function render() {
  renderer.render( scene, camera );  
  cube.rotation.y += 0.01;
  cube.rotation.x += 0.01;
  window.requestAnimationFrame(render);
}