const renderContainer = document.querySelector("#renderer");
const scene = new THREE.Scene();
scene.background = new THREE.Color("skyblue");
//TODO character moves without pressing button
//fix buggy pointerlock

var controls;
var controlsEnabled = true;
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
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// we'll move the camera back a bit so that we can view the scene
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: renderContainer
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial()
);
cube.position.y += 2;
scene.add(cube);

var texture = new THREE.TextureLoader().load( 'https://cdn.glitch.com/09b41b8e-5b1b-470e-8b60-eeaccaea49e9%2Fmud_grass_texture.jpg?v=1570931583854' );

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })
);
ground.rotation.x += Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  //update camera frustum
  camera.updateProjectionMatrix();
});

controls = new THREE.PointerLockControls(camera);
controls.enabled = true;
scene.add(controls.getObject());

var blocker = document.getElementById("blocker");
var instructions = document.getElementById("instructions");
var havePointerLock =
  "pointerLockElement" in document ||
  "mozPointerLockElement" in document ||
  "webkitPointerLockElement" in document;
if (havePointerLock) {
  var element = document.body;
  var pointerlockchange = function(event) {
    if (
      document.pointerLockElement === element ||
      document.mozPointerLockElement === element ||
      document.webkitPointerLockElement === element
    ) {
      controlsEnabled = true;
      controls.enabled = true;
      blocker.style.display = "none";
    } else {
      controls.enabled = false;
      blocker.style.display = "-webkit-box";
      blocker.style.display = "-moz-box";
      blocker.style.display = "box";
      instructions.style.display = "";
    }
  };
  var pointerlockerror = function(event) {
    instructions.style.display = "";
  };
  // Hook pointer lock state change events
  document.addEventListener("pointerlockchange", pointerlockchange, false);
  document.addEventListener("mozpointerlockchange", pointerlockchange, false);
  document.addEventListener(
    "webkitpointerlockchange",
    pointerlockchange,
    false
  );
  document.addEventListener("pointerlockerror", pointerlockerror, false);
  document.addEventListener("mozpointerlockerror", pointerlockerror, false);
  document.addEventListener("webkitpointerlockerror", pointerlockerror, false);
  instructions.addEventListener(
    "click",
    function(event) {
      instructions.style.display = "none";
      // Ask the browser to lock the pointer
      element.requestPointerLock =
        element.requestPointerLock ||
        element.mozRequestPointerLock ||
        element.webkitRequestPointerLock;
      if (/Firefox/i.test(navigator.userAgent)) {
        var fullscreenchange = function(event) {
          if (
            document.fullscreenElement === element ||
            document.mozFullscreenElement === element ||
            document.mozFullScreenElement === element
          ) {
            document.removeEventListener("fullscreenchange", fullscreenchange);
            document.removeEventListener(
              "mozfullscreenchange",
              fullscreenchange
            );
            element.requestPointerLock();
          }
        };
        document.addEventListener("fullscreenchange", fullscreenchange, false);
        document.addEventListener(
          "mozfullscreenchange",
          fullscreenchange,
          false
        );
        element.requestFullscreen =
          element.requestFullscreen ||
          element.mozRequestFullscreen ||
          element.mozRequestFullScreen ||
          element.webkitRequestFullscreen;
        element.requestFullscreen();
      } else {
        element.requestPointerLock();
      }
    },
    false
  );
} else {
  instructions.innerHTML =
    "Your browser doesn't seem to support Pointer Lock API";
}

var onKeyDown = function(event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = true;
      break;
    case 37: // left
    case 65: // a
      moveLeft = true;
      break;
    case 40: // down
    case 83: // s
      moveBackward = true;
      break;
    case 39: // right
    case 68: // d
      moveRight = true;
      break;
    case 32: // space
      if (canJump === true) velocity.y += 35;
      canJump = false;
      break;
  }
};
var onKeyUp = function(event) {
  switch (event.keyCode) {
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
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

render();

function render() {
  renderer.render(scene, camera);
  cube.rotation.y += 0.01;
  cube.rotation.x += 0.01;
  window.requestAnimationFrame(render);

  if (controlsEnabled) {
    const magnitude = 100.0;
    var time = performance.now();
    var delta = (time - prevTime) / 1000;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 10 * delta; // 100. = mass
    if (moveForward) velocity.z -= magnitude * delta;
    if (moveBackward) velocity.z += magnitude * delta;
    if (moveLeft) velocity.x -= magnitude * delta;
    if (moveRight) velocity.x += magnitude * delta;
    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateY(velocity.y * delta);
    controls.getObject().translateZ(velocity.z * delta);
    if (controls.getObject().position.y < 1) {
      velocity.y = 0;
      controls.getObject().position.y = 1;
      canJump = true;
    }
    prevTime = time;
  }
}
