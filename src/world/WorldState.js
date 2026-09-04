import { GAMEPLAY_CONFIG } from '../data/gameplayConfig.js';

export class WorldState {
  constructor({ size = GAMEPLAY_CONFIG.world.size, groundY = GAMEPLAY_CONFIG.world.groundY } = {}) {
    if (!Number.isFinite(size) || size <= 0) throw new Error('WorldState size must be a positive number.');
    if (!Number.isFinite(groundY)) throw new Error('WorldState groundY must be finite.');

    this.size = size;
    this.halfExtent = size / 2;
    this.groundY = groundY;
  }

  isValidGroundDestination(position) {
    if (!position) return false;
    const { x, z } = position;
    return Number.isFinite(x)
      && Number.isFinite(z)
      && x >= -this.halfExtent
      && x <= this.halfExtent
      && z >= -this.halfExtent
      && z <= this.halfExtent;
  }

  clampGroundDestination(position) {
    if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.z)) return null;
    return {
      x: Math.max(-this.halfExtent, Math.min(this.halfExtent, position.x)),
      y: this.groundY,
      z: Math.max(-this.halfExtent, Math.min(this.halfExtent, position.z))
    };
  }
}
