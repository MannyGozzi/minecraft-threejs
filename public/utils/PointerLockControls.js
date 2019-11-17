// this is the largest and most complicated part of the code
// it can be modulized with great effort though
export default class PointerLockControls {
  constructor(camera, voxelWorld, scene) {
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
    this.object.position.y += 80; // 80.0
    this.object.position.x += 5.25;
    this.object.position.z += 5.25;
    this.gravityFactor = 2.0; // 2.0
    this.jumpVel = 7.5;
    this.voxelWorld = voxelWorld;
    this.scene = scene;
    
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
        if (this.canJump === true) this.velocity.y = this.jumpVel;
        this.canJump = false;
        event.preventDefault();  // stop spacebar from scrolling page down
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
    this.cleanCollisionObjects();
    this.updateCollisionObjects();
    if (this.controlsEnabled) {
      const speed = 50.0;
      const time = performance.now();
      const delta = (time - this.prevTime) / 1000;
      let onObject;
      
      // add friction and gravity
      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;
      this.velocity.y -= 9.8 * this.gravityFactor * delta;
      
      // this ensures consistent movements in all directions
      this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
      this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
      this.direction.normalize(); 
      if ( this.moveForward || this.moveBackward ) this.velocity.z += this.direction.z * speed * delta;
      if ( this.moveLeft || this.moveRight ) this.velocity.x += this.direction.x * speed * delta;
      
      // TODO raycasters need to be 0.5 units below or above position in order to precisely detect voxels
      this.raycasters = {
        left:      new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( -1, 0, 0 ), 0, 0.3),
        right:     new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 1, 0, 0 ),  0, 0.3),
        back:      new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 0, 0, 1 ),  0, 0.3),
        front:     new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 0, 0, -1 ), 0, 0.3),
        top:       new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 0, 1, 0 ),  0, 0.3),
        bottom:    new THREE.Raycaster( this.object.position.clone(), new THREE.Vector3( 0, -1, 0 ), 0, this.velocity.y < 0 && -this.velocity * delta < 1 ? -this.velocity.y * (delta + 0.1) : 1)
      };
      
      let canMoveLeft   = true;
      let canMoveRight  = true;
      let canMoveBack   = true;
      let canMoveFront  = true;
      let canMoveTop    = true;
      
      for(const prop in this.raycasters) {
        const hasIntersects = this.raycasters[prop].intersectObjects( this.objects ).length > 0;
        if(prop=="bottom") { this.raycasters[prop].ray.origin.y += -1 + this.velocity.y < 0 && -this.velocity * delta < 1 ? -this.velocity.y * (delta + 0.1) : 1;}
        if(prop=="left"     && hasIntersects) canMoveLeft    = false;
        if(prop=="right"    && hasIntersects) canMoveRight   = false;
        if(prop=="back"     && hasIntersects) canMoveBack    = false;
        if(prop=="front"    && hasIntersects) canMoveFront   = false;
        if(prop=="top"      && hasIntersects) canMoveTop     = false;
        if(prop=="bottom"   && hasIntersects) onObject       = true;
      }
      
      if ( onObject === true ) {
        this.velocity.y = Math.max( 0, this.velocity.y );
        this.canJump = true;
      }
      
      const prevPos = this.object.position.clone();
      this.controls.moveRight( this.velocity.x * delta );
      this.controls.moveForward( this.velocity.z * delta );
      this.controls.getObject().position.y += ( this.velocity.y * delta ); // new behavior
      if(!canMoveLeft && this.object.position.x < prevPos.x)   this.object.position.x = prevPos.x;
      if(!canMoveRight && this.object.position.x > prevPos.x)  this.object.position.x = prevPos.x;
      if(!canMoveBack && this.object.position.z > prevPos.z)   this.object.position.z = prevPos.z;
      if(!canMoveFront && this.object.position.z < prevPos.z)  this.object.position.z = prevPos.z;
      if(!canMoveTop && this.object.position.y > prevPos.z)    this.object.position.y = prevPos.y;


     let info = document.querySelector('.info');
        info.innerHTML = `
                           x    : ${this.object.position.x} <br>
                           y    : ${this.object.position.y} <br>
                           z    : ${this.object.position.z} <br>
                          `;
      this.prevTime = time;
    }
  }
  
  updateCollisionObjects() {
    const xPos = this.object.position.x;
    const yPos = this.object.position.y;
    const zPos = this.object.position.z;
    const xVel = this.velocity.x;
    const yVel = this.velocity.y;
    const zVel = this.velocity.z;

    const unitVec = this.velocity.clone().normalize();
    const currPos = this.object.position.clone().floor().add(new THREE.Vector3(0.0, 0.5, 0.0));
    this.getNearbyCollisionObjects(currPos.x, currPos.y - 0.5, currPos.z);
    
    // needs to be optimized
    // this.objects  = [];
    
    let   steps   = 0;
    while(steps < this.velocity.length() + 1) {
      const unitVecPicker = unitVec.clone().multiplyScalar(steps);
      const pos = currPos.clone().add(unitVecPicker).floor();
      if(this.voxelWorld.getVoxel(pos.x, pos.y, pos.z)) {
        const object = new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xFF0000}));
        object.position.set(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5);
        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();
        this.objects.push(object);
        this.scene.add(object);
        break;
      }
      steps += 1;
    }
  }
  
  getNearbyCollisionObjects(x_, y_, z_) {
    for(let y = y_ - 1; y <= y_ + 1; y += 1) {
      for(let z = z_ -1; z <= z_ + 1; z += 1) {
        for(let x = x_ -1; x <= x_ + 1; x+=1) {
          if(this.voxelWorld.getVoxel(x, y, z)) {
            const object = new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xFF0000}));
            object.position.set(x + 0.5, y + 0.5, z + 0.5);
            object.geometry.computeBoundingBox();
            object.geometry.computeBoundingSphere();
            this.objects.push(object);
            this.scene.add(object);
          }
        }
      }
    }
  }
  
  
  cleanCollisionObjects() {
    this.objects.filter(object => {
      if (object.position.distanceTo(this.object.position) > 5) {
        this.scene.remove(object);
        return true;
      }
      return false;
    });
  }
}