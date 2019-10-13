 export function initPointerLockControls(THREE) {
    THREE.PointerLockControls = function ( camera, domElement ) {

        var scope = this;

        this.domElement = domElement || document.body;
        this.isLocked = false;
        let cameraSensitivity = 0.002;

        var pitchObject = new THREE.Object3D();
        pitchObject.position.y = 1.6; //5' 6"
        var yawObject = new THREE.Object3D();
        yawObject.position.y = 1.6; //5' 6"
        pitchObject.add( camera );
        yawObject.add( pitchObject );

        var PI_2 = Math.PI / 2;

        function onMouseMove( event ) {

            if ( scope.isLocked === false ) return;

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            //horizontal movement
            yawObject.rotation.y -= movementX * cameraSensitivity;
            //vertical movement
            pitchObject.rotation.x -= movementY * cameraSensitivity;

            pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

        }

        function onPointerlockChange() {

            if ( document.pointerLockElement === scope.domElement ) {

                scope.dispatchEvent( { type: 'lock' } );

                scope.isLocked = true;

            } else {

                scope.dispatchEvent( { type: 'unlock' } );

                scope.isLocked = false;

            }

        }

        function onPointerlockError() {

            console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

        }

        this.connect = function () {

            document.addEventListener( 'mousemove', onMouseMove, false );
            document.addEventListener( 'pointerlockchange', onPointerlockChange, false );
            document.addEventListener( 'pointerlockerror', onPointerlockError, false );

        };

        this.disconnect = function () {

            document.removeEventListener( 'mousemove', onMouseMove, false );
            document.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
            document.removeEventListener( 'pointerlockerror', onPointerlockError, false );

        };

        this.dispose = function () {

            this.disconnect();

        };

        this.getObject = function () {

            return yawObject;

        };

        this.getPitchObject = function() {
            return pitchObject;
        };

        this.getDirection = function () {

            // assumes the camera itself is not rotated

            var direction = new THREE.Vector3( 0, 0, -1 );
            var rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );

            return function ( v ) {

                rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

                v.copy( direction ).applyEuler( rotation );

                return v;

            };

        }();

        this.getRotation = function() {
            //yaw   |  horizontal movement
            //pitch |  vertical movement
            return new THREE.Euler(pitchObject.rotation.x, yawObject.rotation.y, 0);
        };

        this.lock = function () {

            this.domElement.requestPointerLock();

        };

        this.unlock = function () {

            document.exitPointerLock();

        };

        this.connect();

    };

    THREE.PointerLockControls.prototype = Object.create( THREE.EventDispatcher.prototype );
    THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;
}