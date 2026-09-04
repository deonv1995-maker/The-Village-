import { WorldScene } from '../rendering/WorldScene.js';
import { CameraController } from '../input/CameraController.js';
import { SelectionController } from '../input/SelectionController.js';
import { createStarterVillagers } from '../villagers/createStarterVillagers.js';
import { VillagerViewSystem } from '../rendering/VillagerViewSystem.js';
import { SelectionSystem } from '../selection/SelectionSystem.js';

export class VillageGame {
  constructor({ container }) {
    if (!container) throw new Error('VillageGame requires a render container.');
    this.container = container;
    this.worldScene = null;
    this.cameraController = null;
    this.selectionController = null;
    this.selection = null;
    this.unsubscribeSelection = null;
    this.villagers = null;
    this.villagerViews = null;
    this.animationFrame = 0;
    this.lastTime = 0;
  }

  start() {
    this.villagers = createStarterVillagers();
    this.worldScene = new WorldScene({ container: this.container });
    this.villagerViews = new VillagerViewSystem({
      scene: this.worldScene.scene,
      villagers: this.villagers
    });
    this.selection = new SelectionSystem({
      validIds: this.villagers.map((villager) => villager.id)
    });
    this.unsubscribeSelection = this.selection.subscribe((selectedIds) => {
      this.villagerViews?.setSelectedIds(selectedIds);
    });

    const element = this.worldScene.renderer.domElement;
    this.cameraController = new CameraController({
      element,
      camera: this.worldScene.camera,
      target: this.worldScene.cameraTarget
    });
    this.selectionController = new SelectionController({
      element,
      camera: this.worldScene.camera,
      villagerViews: this.villagerViews,
      selection: this.selection
    });

    this.worldScene.resize();
    window.addEventListener('resize', this.handleResize, { passive: true });
    this.lastTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.tick);
  }

  handleResize = () => {
    this.worldScene?.resize();
  };

  tick = (time) => {
    const deltaSeconds = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;
    this.cameraController?.update(deltaSeconds);
    this.villagerViews?.update(deltaSeconds);
    this.worldScene?.render();
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  stop() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
    this.selectionController?.dispose();
    this.cameraController?.dispose();
    this.unsubscribeSelection?.();
    this.villagerViews?.dispose();
    this.selection?.dispose();
    this.worldScene?.dispose();

    this.selectionController = null;
    this.cameraController = null;
    this.unsubscribeSelection = null;
    this.villagerViews = null;
    this.selection = null;
    this.worldScene = null;
    this.villagers = null;
  }
}
