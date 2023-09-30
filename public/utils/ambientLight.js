import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export default function AmbientLight() {
  const color = 0xffffff;
  const intensity = 0.2;
  const ambientLight = new THREE.AmbientLight(color, intensity);
  return ambientLight;
}
