import * as THREE from 'three';
import { VillagerAssetFactory } from './villagers/VillagerAssetFactory.js';

export class VillagerViewSystem {
  constructor({ scene, villagers }) {
    this.scene = scene;
    this.views = new Map();
    this.pickRoots = [];
    this.assetFactory = new VillagerAssetFactory();
    this.raycaster = new THREE.Raycaster();
    this.pointerNdc = new THREE.Vector2();
    this.markerGeometry = new THREE.RingGeometry(0.38, 0.50, 28);
    this.markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xe9f0d0,
      transparent: true,
      opacity: 0.85,
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
      marker.visible = false;
      root.add(marker);

      // Desynchronize idle loops without introducing non-deterministic appearance state.
      model.update(index * 0.31);

      this.scene.add(root);
      this.pickRoots.push(root);
      this.views.set(villager.id, { root, model, marker, villager });
    });
  }

  setSelectedIds(selectedIds) {
    const selected = new Set(selectedIds);
    for (const [villagerId, view] of this.views) {
      view.marker.visible = selected.has(villagerId);
    }
  }

  pickVillager({ clientX, clientY, camera, element }) {
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    this.pointerNdc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(this.pointerNdc, camera);

    const intersections = this.raycaster.intersectObjects(this.pickRoots, true);
    for (const intersection of intersections) {
      let object = intersection.object;
      while (object) {
        const villagerId = object.userData?.villagerId;
        if (villagerId && this.views.has(villagerId)) return villagerId;
        object = object.parent;
      }
    }

    return null;
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
    this.pickRoots.length = 0;
    this.markerGeometry.dispose();
    this.markerMaterial.dispose();
    this.assetFactory.dispose();
  }
}
