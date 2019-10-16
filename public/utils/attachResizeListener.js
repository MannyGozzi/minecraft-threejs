export default function attachResizeListener(renderer, camera) {
    //resize canvas if window size is changed
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    //update camera frustum
    camera.updateProjectionMatrix();
  });
}