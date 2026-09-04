import test from 'node:test';
import assert from 'node:assert/strict';
import { WorldState } from '../src/world/WorldState.js';
import { NavigationSystem } from '../src/navigation/NavigationSystem.js';
import { CommandSystem } from '../src/commands/CommandSystem.js';

function createVillager(id, x, z) {
  return {
    id,
    position: { x, y: 0, z },
    heading: 0,
    state: 'idle'
  };
}

test('world state rejects invalid ground destinations and clamps formation targets safely', () => {
  const world = new WorldState({ size: 20, groundY: 0 });

  assert.equal(world.isValidGroundDestination({ x: 10, z: -10 }), true);
  assert.equal(world.isValidGroundDestination({ x: 10.01, z: 0 }), false);
  assert.equal(world.isValidGroundDestination({ x: Number.NaN, z: 0 }), false);
  assert.deepEqual(world.clampGroundDestination({ x: 15, z: -14 }), { x: 10, y: 0, z: -10 });
});

test('single-villager move command uses navigation and completes at the requested destination', () => {
  const world = new WorldState({ size: 30 });
  const villager = createVillager('villager-001', 0, 0);
  const navigation = new NavigationSystem({ villagers: [villager], world, moveSpeed: 4, arrivalThreshold: 0.01 });
  const commands = new CommandSystem({ villagers: [villager], navigation, world });

  const result = commands.issueMove({
    villagerIds: [villager.id],
    destination: { x: 4, y: 0, z: 0 }
  });

  assert.deepEqual(result, { accepted: true, issued: 1, reason: null });
  assert.equal(villager.state, 'moving');
  assert.deepEqual(navigation.getDestination(villager.id), { x: 4, y: 0, z: 0 });

  navigation.update(0.5);
  assert.equal(villager.position.x, 2);
  assert.equal(villager.state, 'moving');

  navigation.update(0.5);
  assert.deepEqual(villager.position, { x: 4, y: 0, z: 0 });
  assert.equal(villager.state, 'idle');
  assert.equal(navigation.getDestination(villager.id), null);
});

test('group move command preserves the current formation around the requested destination', () => {
  const world = new WorldState({ size: 40 });
  const left = createVillager('villager-001', -1, 0);
  const right = createVillager('villager-002', 1, 0);
  const villagers = [left, right];
  const navigation = new NavigationSystem({ villagers, world });
  const commands = new CommandSystem({ villagers, navigation, world });

  const result = commands.issueMove({
    villagerIds: villagers.map((villager) => villager.id),
    destination: { x: 10, y: 0, z: 5 }
  });

  assert.equal(result.accepted, true);
  assert.equal(result.issued, 2);
  assert.deepEqual(navigation.getDestination(left.id), { x: 9, y: 0, z: 5 });
  assert.deepEqual(navigation.getDestination(right.id), { x: 11, y: 0, z: 5 });
});

test('move commands reject empty selections and destinations outside the authoritative world', () => {
  const world = new WorldState({ size: 20 });
  const villager = createVillager('villager-001', 0, 0);
  const navigation = new NavigationSystem({ villagers: [villager], world });
  const commands = new CommandSystem({ villagers: [villager], navigation, world });

  assert.deepEqual(
    commands.issueMove({ villagerIds: [], destination: { x: 1, y: 0, z: 1 } }),
    { accepted: false, issued: 0, reason: 'no-villagers' }
  );
  assert.deepEqual(
    commands.issueMove({ villagerIds: [villager.id], destination: { x: 20, y: 0, z: 0 } }),
    { accepted: false, issued: 0, reason: 'invalid-destination' }
  );
  assert.equal(villager.state, 'idle');
  assert.equal(navigation.getDestination(villager.id), null);
});

test('a new move request replaces the previous destination without duplicating work', () => {
  const world = new WorldState({ size: 40 });
  const villager = createVillager('villager-001', 0, 0);
  const navigation = new NavigationSystem({ villagers: [villager], world });

  assert.equal(navigation.requestMove(villager.id, { x: 5, y: 0, z: 0 }), true);
  assert.equal(navigation.requestMove(villager.id, { x: 0, y: 0, z: 6 }), true);
  assert.deepEqual(navigation.getDestination(villager.id), { x: 0, y: 0, z: 6 });
});
