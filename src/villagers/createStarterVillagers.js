import { createVillagerAppearance } from '../data/villagerAppearanceCatalog.js';

const STARTER_LAYOUT = Object.freeze([
  { position: [-4.0, -1.3], appearancePresetId: 'male_a' },
  { position: [-2.0, 1.1], appearancePresetId: 'male_b' },
  { position: [0.0, -0.8], appearancePresetId: 'female_a' },
  { position: [2.1, 1.2], appearancePresetId: 'female_b' },
  { position: [4.0, -1.0], appearancePresetId: 'boy' },
  { position: [0.6, 3.7], appearancePresetId: 'girl' }
]);

export function createStarterVillagers() {
  return STARTER_LAYOUT.map(({ position: [x, z], appearancePresetId }, index) => ({
    id: `villager-${String(index + 1).padStart(3, '0')}`,
    displayName: `Villager ${index + 1}`,
    position: { x, y: 0, z },
    state: 'idle',
    appearance: createVillagerAppearance(appearancePresetId)
  }));
}
