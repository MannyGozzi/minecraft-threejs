export default class PointerLockControls {
  constructor(camera) {
    this.controls;
    this.controlsEnabled = true;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.canJump = false;
    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.controls = new THREE.PointerLockControls(camera);
    this.object = this.controls.getObject();
    			this objects = [];
			var raycaster;
    
    let blocker = document.getElementById("blocker");
let instructions = document.getElementById("instructions");
let havePointerLock =
  "pointerLockElement" in document ||
  "mozPointerLockElement" in document ||
  "webkitPointerLockElement" in document;
if (havePointerLock) {
  let element = document.body;
  let pointerlockchange = function(event) {
    if (
      document.pointerLockElement === element ||
      document.mozPointerLockElement === element ||
      document.webkitPointerLockElement === element
    ) {
      this.controlsEnabled = true;
      blocker.style.display = "none";
    } else {
      blocker.style.display = "-webkit-box";
      blocker.style.display = "-moz-box";
      blocker.style.display = "box";
      instructions.style.display = "";
    }
  };
  let pointerlockerror = function(event) {
    instructions.style.display = "";
  };
  // Hook pointer lock state change events
  document.addEventListener("pointerlockchange", pointerlockchange, false);
  document.addEventListener("mozpointerlockchange", pointerlockchange, false);
  document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
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
        let fullscreenchange = function(event) {
          if (
            document.fullscreenElement === element ||
            document.mozFullscreenElement === element ||
            document.mozFullScreenElement === element
          ) {
            document.rethis.moveEventListener("fullscreenchange", fullscreenchange);
            document.rethis.moveEventListener(
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

let onKeyDown = (event) => {

  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      this.moveForward = true;
      break;
    case 37: // left
    case 65: // a
      this.moveLeft = true;
      break;
    case 40: // down
    case 83: // s
      this.moveBackward = true;
      break;
    case 39: // right
    case 68: // d
      this.moveRight = true;
      break;
    case 32: // space
      if (this.canJump === true) this.velocity.y = 30;
      this.canJump = false;
      break;
  }
};
let onKeyUp = (event) => {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      this.moveForward = false;
      break;
    case 37: // left
    case 65: // a
      this.moveLeft = false;
      break;
    case 40: // down
    case 83: // s
      this.moveBackward = false;
      break;
    case 39: // right
    case 68: // d
      this.moveRight = false;
      break;
  }
};
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
  }

  update() {
    if (this.controlsEnabled) {
    const magnitude = 50.0;
    let time = performance.now();
    let delta = (time - this.prevTime) / 1000;
    //add friction and gravity to velocity
    this.velocity.x -= this.velocity.x * 10 * delta;
    this.velocity.z -= this.velocity.z * 10 * delta;
    this.velocity.y -= 9.8 * 10 * delta; // 100. = mass
    if (this.moveForward) this.velocity.z -= magnitude * delta;
    if (this.moveBackward) this.velocity.z += magnitude * delta;
    if (this.moveLeft) this.velocity.x -= magnitude * delta;
    if (this.moveRight) this.velocity.x += magnitude * delta;
    this.object.translateX(this.velocity.x * delta);
    //fixes bug bc y-tilt would affect x, z movement
   let info = document.querySelector('.info');
      info.innerHTML = `x: ${this.object.position.x} <br>
                                         y: ${this.object.position.y} <br>
                                         z: ${this.object.position.z}`;
    this.object.position.y += this.velocity.y * delta;
    this.object.translateZ(this.velocity.z * delta);
    if (this.object.position.y < 1) {
      this.velocity.y = 0;
      this.object.position.y = 1;
      this.canJump = true;
    }
    this.prevTime = time;
  }
  }



}