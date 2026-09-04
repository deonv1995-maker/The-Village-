export function createStarterVillagers() {
  const positions = [
    [-3.8, -1.2],
    [-1.4, 1.1],
    [1.2, -0.7],
    [3.6, 1.5],
    [0.3, 3.5]
  ];

  return positions.map(([x, z], index) => ({
    id: `villager-${String(index + 1).padStart(3, '0')}`,
    displayName: `Villager ${index + 1}`,
    position: { x, y: 0, z },
    state: 'idle'
  }));
}
