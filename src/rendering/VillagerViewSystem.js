import * as THREE from 'three';
import { VillagerAssetFactory } from './villagers/VillagerAssetFactory.js';

export class VillagerViewSystem {
  constructor({ scene, villagers }) {
    this.scene = scene;
    this.views = new Map();
    this.assetFactory = new VillagerAssetFactory();
    this.markerGeometry = new THREE.RingGeometry(0.38, 0.48, 24);
    this.markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xe9f0d0,
      transparent: true,
      opacity: 0.50,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    villagers.forEach((villager, index) => {
      const model = this.assetFactory.create(villager.appearance);
      const root = model.root;
      root.position.set(villager.position.x, villager.position.y, villager.position.z);
      root.userData.villagerId = villager.id;

      const marker = new THREE.Mesh(this.markerGeometry, this.markerMaterial);
      marker.rotation.x = -Math.PI / 2;
      marker.position.y = 0.012;
      marker.scale.setScalar(Math.max(0.72, Math.min(1, root.userData.height / 1.7)));
      root.add(marker);

      // Desynchronize idle loops without introducing non-deterministic appearance state.
      model.update(index * 0.31);

      this.scene.add(root);
      this.views.set(villager.id, { root, model, villager });
    });
  }

  update(deltaSeconds) {
    for (const view of this.views.values()) {
      view.model.setAnimation(view.villager.state === 'moving' ? 'walk' : 'idle');
      view.model.update(deltaSeconds);
    }
  }

  dispose() {
    for (const view of this.views.values()) {
      this.scene.remove(view.root);
      view.model.dispose();
    }
    this.views.clear();
    this.markerGeometry.dispose();
    this.markerMaterial.dispose();
    this.assetFactory.dispose();
  }
}
