//TODO work on collisions
//get all surrounding voxels from the current position and make them into collision objects
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
    this.object.position.y += 90;
    this.object.position.x += 5.2;
    
    this.objects = [];
    this.direction = new THREE.Vector3();
    this.vertex = new THREE.Vector3();

    
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
      if (this.canJump === true) this.velocity.y = 25;
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
  
  setObjects(objects) {
    this.objects = objects;
  }
  
  pushIntersectObject(object) {
    this.objects.push(object);
  }

  update() {
    if (this.controlsEnabled) {
      const speed = 2.0;
      const time = performance.now();
      const friction = 0.01;
      const delta = (time - this.prevTime) / 1000;
      let onObject;
      
      //add friction to velocity vectors
      this.velocity.x *= Math.pow(friction, delta);
      this.velocity.z *= Math.pow(friction, delta);
      
      //add gravity
      this.velocity.y -= 9.8 * 3 * delta; // 100.0 = mass
      
      if (this.moveRight) this.velocity.x += speed;
      if (this.moveLeft) this.velocity.x -= speed;
      if (this.moveForward) this.velocity.z += speed;
      if (this.moveBackward) this.velocity.z -= speed;
      const yVel = this.velocity.y;
      this.velocity.normalize();
      this.velocity.multiplyScalar(speed);
      this.velocity.y = yVel;
      
      const axis = new THREE.Vector3( 0, 1, 0 );
      const angle = this.object.rotation.y;
      
      this.raycasters = {
        left:       new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( -1, 0, 0 ).applyAxisAngle(axis, angle), 0, 1),
        right:     new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 1, 0, 0 ).applyAxisAngle(axis, angle), 0, 1),
        back:    new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, -1 ).applyAxisAngle(axis, angle), 0, 1),
        front:     new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 1 ).applyAxisAngle(axis, angle), 0, 1 ),
        top:        new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ).applyAxisAngle(axis, angle), 0, 1 ),
        bottom: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0 ).applyAxisAngle(axis, angle), 0, 2 )
      };
      
      for(const prop in this.raycasters) {
        this.raycasters[prop].ray.origin.copy(this.controls.getObject().position );
        if(prop=="left" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.velocity.x=Math.max( this.velocity.x, 0 );}
        if(prop=="right" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.velocity.x=Math.min( this.velocity.x, 0 );}
        if(prop=="back" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.velocity.z=Math.max( this.velocity.z, 0 );}
        if(prop=="front" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.velocity.z=Math.min( this.velocity.z, 0 );}
        if(prop=="top" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.velocity.y=Math.min( this.velocity.y, 0 );}
        if(prop=="bottom" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {onObject = true;}
      }
      
        if ( onObject === true ) {
          this.velocity.y = Math.max( 0, this.velocity.y );
          this.canJump = true;
      }

      this.controls.moveRight( this.velocity.x * delta );
      this.controls.moveForward( this.velocity.z * delta );
      this.controls.getObject().position.y += ( this.velocity.y * delta ); // new behavior

     let info = document.querySelector('.info');
        info.innerHTML = `x vel: ${-this.velocity.x} <br>
                                           y vel: ${this.velocity.y} <br>
                                           z vel: ${-this.velocity.z}`;
      this.prevTime = time;
    }
  }
}

// TODO if last pos changes left, right, back or whatever only then check raycasters