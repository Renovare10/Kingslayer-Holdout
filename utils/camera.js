export function setupCamera(scene, backgroundColor = '#E7C8A2', zoom = 0.5) {
  const camera = scene.cameras.main;
  camera.setBackgroundColor(backgroundColor);
  camera.setZoom(zoom);
}