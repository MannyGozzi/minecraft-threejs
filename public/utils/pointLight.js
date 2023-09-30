import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export default function PointLight() {
  const color = 0xffffff;
  const intensity = 1;
  const pointLight = new THREE.DirectionalLight(color, intensity);
  pointLight.position.set(-1, 5, 4);
  return pointLight;
}
