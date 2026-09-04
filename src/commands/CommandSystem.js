export class CommandSystem {
  constructor({ villagers, navigation, world }) {
    if (!Array.isArray(villagers) || !navigation || !world) {
      throw new Error('CommandSystem requires villagers, navigation, and world.');
    }

    this.villagers = new Map(villagers.map((villager) => [villager.id, villager]));
    this.navigation = navigation;
    this.world = world;
  }

  issueMove({ villagerIds, destination }) {
    if (!Array.isArray(villagerIds) || villagerIds.length === 0) {
      return { accepted: false, issued: 0, reason: 'no-villagers' };
    }

    if (!this.world.isValidGroundDestination(destination)) {
      return { accepted: false, issued: 0, reason: 'invalid-destination' };
    }

    const villagers = villagerIds
      .map((id) => this.villagers.get(id))
      .filter(Boolean);

    if (villagers.length === 0) {
      return { accepted: false, issued: 0, reason: 'no-valid-villagers' };
    }

    const centroid = villagers.reduce((sum, villager) => {
      sum.x += villager.position.x;
      sum.z += villager.position.z;
      return sum;
    }, { x: 0, z: 0 });
    centroid.x /= villagers.length;
    centroid.z /= villagers.length;

    let issued = 0;
    for (const villager of villagers) {
      const desired = villagers.length === 1
        ? destination
        : {
            x: destination.x + (villager.position.x - centroid.x),
            y: this.world.groundY,
            z: destination.z + (villager.position.z - centroid.z)
          };
      const target = this.world.clampGroundDestination(desired);
      if (target && this.navigation.requestMove(villager.id, target)) issued += 1;
    }

    return {
      accepted: issued > 0,
      issued,
      reason: issued > 0 ? null : 'navigation-rejected'
    };
  }

  dispose() {
    this.villagers.clear();
  }
}
