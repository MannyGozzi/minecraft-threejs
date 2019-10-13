const renderContainer = document.querySelector('#renderer');
const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

var controls;
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();

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

const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({color: 0x00ff22, side: THREE.DoubleSide}));
ground.rotation.x += Math.PI / 2;
ground.position.y -= 2;
scene.add(ground);

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    //update camera frustum
    camera.updateProjectionMatrix();
});

controls = new THREE.PointerLockControls( camera );
scene.add( controls.getObject() );
  
var onKeyDown = function ( event ) {
    switch ( event.keyCode ) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true; break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      case 32: // space
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
        break;
    }
  };
  var onKeyUp = function ( event ) {
    switch( event.keyCode ) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );


render();

function render() {
  renderer.render( scene, camera );  
  cube.rotation.y += 0.01;
  cube.rotation.x += 0.01;
  window.requestAnimationFrame(render);
  
  if ( controlsEnabled ) {
					var time = performance.now();
					var delta = ( time - prevTime ) / 1000;
					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;
					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
					if ( moveForward ) velocity.z -= 400.0 * delta;
					if ( moveBackward ) velocity.z += 400.0 * delta;
					if ( moveLeft ) velocity.x -= 400.0 * delta;
					if ( moveRight ) velocity.x += 400.0 * delta;
					controls.getObject().translateX( velocity.x * delta );
					controls.getObject().translateY( velocity.y * delta );
					controls.getObject().translateZ( velocity.z * delta );
					if ( controls.getObject().position.y < 10 ) {
						velocity.y = 0;
						controls.getObject().position.y = 10;
						canJump = true;
					}
					prevTime = time;
				}
}