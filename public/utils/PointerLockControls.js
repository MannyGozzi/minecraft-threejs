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
    this.object.rotation.order = 'YXZ';
    this.gravityIntensity = 0.1;
    this.object.position.y = 50;
    this.object.position.x += 12;
    this.object.position.z += 5;
    this.worldVel = new THREE.Vector3();
    
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
      const speed = 3.0;
      const time = performance.now();
      const friction = 0.5;
      const delta = (time - this.prevTime) / 1000;
      let onObject;
      
      //add friction to velocity vectors and gravity to y vector
      this.velocity.x *= friction;
      this.velocity.z *= friction;
      this.velocity.y -= 9.8 * this.gravityIntensity * delta; // 100.0 = mass
      
      //change relative velocity of object
      if (this.moveRight) this.velocity.x += speed;
      if (this.moveLeft) this.velocity.x -= speed;
      if (this.moveForward) this.velocity.z += speed;
      if (this.moveBackward) this.velocity.z -= speed;
      
      const yRot = this.object.rotation.y;
      this.worldVel.x = Math.cos(yRot) * this.velocity.x - Math.sin(yRot) * this.velocity.z;
      this.worldVel.y = this.velocity.y;
      this.worldVel.z = Math.cos(yRot) * this.velocity.z + Math.sin(yRot) * this.velocity.x ;
      
      
      this.raycasters = {
        left:       new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( -1, 0, 0 ), 0, 1),
        right:     new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 1, 0, 0 ), 0, 1),
        back:    new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 0, 0, -1 ), 0, 1),
        front:     new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 0, 0, 1 ), 0, 1 ),
        top:        new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 0, 1, 0 ), 0, 1 ),
        bottom: new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 0, -1, 0 ), 0, Math.abs(this.velocity.y ) ) //set a high length bc vertical accel can be high so it needs to check farther down
      };
      
      for(const prop in this.raycasters) {
        if(prop =="bottom") {this.raycasters['bottom'].ray.origin.y += Math.abs(this.velocity.y ) - 2;}
        if(prop=="left" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.worldVel.x=Math.max( this.worldVel.x, 0 );}
        if(prop=="right" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.worldVel.x=Math.min( this.worldVel.x, 0 );}
        if(prop=="back" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.worldVel.z=Math.max( this.worldVel.z, 0 );}
        if(prop=="front" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.worldVel.z=Math.min( this.worldVel.z, 0 );}
        if(prop=="top" && this.raycasters[prop].intersectObjects( this.objects ).length>0) {this.worldVel.y=Math.min( this.worldVel.y, 0 );}
        if(prop=="bottom" && this.raycasters[prop].intersectObjects( this.objects ).length>0){onObject = true;}
      }
      
        if ( onObject === true ) {
          this.velocity.y = Math.max( 0, this.velocity.y );
          this.worldVel.y = this.velocity.clone().y;
          this.canJump = true;
      }
      
      //move object relative to world
      //TODO convert worldVel to object relative vel
      this.object.getWorldPosition().add(this.worldVel.clone().multiplyScalar(delta));

     let info = document.querySelector('.info');
        info.innerHTML = `world x vel: ${this.worldVel.x} <br>
                                           world y vel: ${this.velocity.y} <br>
                                           world z vel: ${this.worldVel.z}<br>
                                           yRot           : ${this.object.rotation.y}`;
      this.prevTime = time;
    }
  }
}