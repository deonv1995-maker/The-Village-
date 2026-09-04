import { WorldScene } from '../rendering/WorldScene.js';
import { CameraController } from '../input/CameraController.js';
import { createStarterVillagers } from '../villagers/createStarterVillagers.js';
import { VillagerViewSystem } from '../rendering/VillagerViewSystem.js';

export class VillageGame {
  constructor({ container }) {
    if (!container) throw new Error('VillageGame requires a render container.');
    this.container = container;
    this.worldScene = null;
    this.cameraController = null;
    this.villagerViews = null;
    this.animationFrame = 0;
    this.lastTime = 0;
  }

  start() {
    const villagers = createStarterVillagers();
    this.worldScene = new WorldScene({ container: this.container });
    this.villagerViews = new VillagerViewSystem({ scene: this.worldScene.scene, villagers });
    this.cameraController = new CameraController({
      element: this.worldScene.renderer.domElement,
      camera: this.worldScene.camera,
      target: this.worldScene.cameraTarget
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
    this.cameraController?.dispose();
    this.villagerViews?.dispose();
    this.worldScene?.dispose();
  }
}
