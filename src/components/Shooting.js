export default class Shooting {
  constructor(cooldown) {
    this.enabled = true;
    this.cooldown = cooldown; // Cooldown in milliseconds
    this.currentCooldown = 0; // Current cooldown remaining
  }
}