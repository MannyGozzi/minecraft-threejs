export default function AmbientLight() {
  const color = 0xffffff;
  const intensity = 0.4;
  const ambientLight = new THREE.AmbientLight(color, intensity);
  return ambientLight;
}
