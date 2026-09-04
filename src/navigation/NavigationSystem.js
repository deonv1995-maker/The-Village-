import { GAMEPLAY_CONFIG } from '../data/gameplayConfig.js';

export class NavigationSystem {
  constructor({ villagers, world, moveSpeed = GAMEPLAY_CONFIG.movement.villagerSpeed, arrivalThreshold = GAMEPLAY_CONFIG.movement.arrivalThreshold }) {
    if (!Array.isArray(villagers) || !world) {
      throw new Error('NavigationSystem requires villagers and world.');
    }

    this.villagers = new Map(villagers.map((villager) => [villager.id, villager]));
    this.world = world;
    this.moveSpeed = moveSpeed;
    this.arrivalThreshold = arrivalThreshold;
    this.requests = new Map();
  }

  requestMove(villagerId, destination) {
    const villager = this.villagers.get(villagerId);
    if (!villager || !this.world.isValidGroundDestination(destination)) return false;

    const target = {
      x: destination.x,
      y: this.world.groundY,
      z: destination.z
    };

    const dx = target.x - villager.position.x;
    const dz = target.z - villager.position.z;
    const distance = Math.hypot(dx, dz);

    if (distance <= this.arrivalThreshold) {
      villager.position.x = target.x;
      villager.position.y = target.y;
      villager.position.z = target.z;
      villager.state = 'idle';
      this.requests.delete(villagerId);
      return true;
    }

    this.requests.set(villagerId, target);
    villager.state = 'moving';
    return true;
  }

  cancelMove(villagerId) {
    const villager = this.villagers.get(villagerId);
    const removed = this.requests.delete(villagerId);
    if (removed && villager) villager.state = 'idle';
    return removed;
  }

  getDestination(villagerId) {
    const destination = this.requests.get(villagerId);
    return destination ? { ...destination } : null;
  }

  update(deltaSeconds) {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;

    for (const [villagerId, target] of this.requests) {
      const villager = this.villagers.get(villagerId);
      if (!villager) {
        this.requests.delete(villagerId);
        continue;
      }

      const dx = target.x - villager.position.x;
      const dz = target.z - villager.position.z;
      const distance = Math.hypot(dx, dz);

      if (distance <= this.arrivalThreshold) {
        villager.position.x = target.x;
        villager.position.y = target.y;
        villager.position.z = target.z;
        villager.state = 'idle';
        this.requests.delete(villagerId);
        continue;
      }

      villager.heading = Math.atan2(dx, dz);
      const step = Math.min(distance, this.moveSpeed * deltaSeconds);
      villager.position.x += (dx / distance) * step;
      villager.position.z += (dz / distance) * step;
      villager.position.y = this.world.groundY;

      if (step >= distance - this.arrivalThreshold) {
        villager.position.x = target.x;
        villager.position.z = target.z;
        villager.state = 'idle';
        this.requests.delete(villagerId);
      }
    }
  }

  dispose() {
    for (const villagerId of this.requests.keys()) this.cancelMove(villagerId);
    this.requests.clear();
    this.villagers.clear();
  }
}
