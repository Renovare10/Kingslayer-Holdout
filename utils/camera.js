export function setupCamera(scene, targetSprite, backgroundColor = '#87CEEB', zoom = 0.5) {
  const camera = scene.cameras.main;
  camera.setBackgroundColor(backgroundColor);
  camera.setZoom(zoom);
  if (targetSprite) {
      camera.startFollow(targetSprite);
  }
}