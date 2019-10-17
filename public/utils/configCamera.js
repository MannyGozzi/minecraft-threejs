export default function configCamera() {
   // Create a Camera
  const fov = 90; // AKA Field of View
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1; // the near clipping plane
  const far = 1000; // the far clipping plane
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // we'll move the camera back a bit so that we can view the scene
  return camera;
}