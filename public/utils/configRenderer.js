import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
export default function configRenderer(renderContainer) {
  //initialize the renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: renderContainer
  });
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer;
}