export default class Lifespan {
  constructor(createdAt, duration) {
    this.createdAt = createdAt; // Timestamp when entity was created
    this.duration = duration;   // Lifespan in milliseconds
  }
}