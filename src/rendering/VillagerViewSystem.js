import * as THREE from 'three';

export class VillagerViewSystem {
  constructor({ scene, villagers }) {
    this.scene = scene;
    this.views = new Map();

    const bodyGeometry = new THREE.CapsuleGeometry(0.42, 0.85, 5, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xd6b06f, roughness: 0.9 });
    const markerGeometry = new THREE.RingGeometry(0.58, 0.72, 24);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xe9f0d0,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });

    for (const villager of villagers) {
      const root = new THREE.Group();
      root.position.set(villager.position.x, villager.position.y, villager.position.z);
      root.userData.villagerId = villager.id;

      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.85;
      root.add(body);

      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.rotation.x = -Math.PI / 2;
      marker.position.y = 0.02;
      root.add(marker);

      this.scene.add(root);
      this.views.set(villager.id, root);
    }
  }

  update() {}

  dispose() {
    for (const root of this.views.values()) {
      this.scene.remove(root);
    }
    this.views.clear();
  }
}
