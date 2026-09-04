import { WorldScene } from '../rendering/WorldScene.js';
import { CameraController } from '../input/CameraController.js';
import { WorldInteractionController } from '../input/WorldInteractionController.js';
import { createStarterVillagers } from '../villagers/createStarterVillagers.js';
import { VillagerViewSystem } from '../rendering/VillagerViewSystem.js';
import { SelectionSystem } from '../selection/SelectionSystem.js';
import { WorldState } from '../world/WorldState.js';
import { NavigationSystem } from '../navigation/NavigationSystem.js';
import { CommandSystem } from '../commands/CommandSystem.js';

export class VillageGame {
  constructor({ container }) {
    if (!container) throw new Error('VillageGame requires a render container.');
    this.container = container;
    this.world = null;
    this.worldScene = null;
    this.cameraController = null;
    this.worldInteractionController = null;
    this.selection = null;
    this.navigation = null;
    this.commands = null;
    this.unsubscribeSelection = null;
    this.villagers = null;
    this.villagerViews = null;
    this.animationFrame = 0;
    this.lastTime = 0;
  }

  start() {
    this.villagers = createStarterVillagers();
    this.world = new WorldState();
    this.worldScene = new WorldScene({ container: this.container, world: this.world });
    this.villagerViews = new VillagerViewSystem({
      scene: this.worldScene.scene,
      villagers: this.villagers
    });
    this.selection = new SelectionSystem({
      validIds: this.villagers.map((villager) => villager.id)
    });
    this.navigation = new NavigationSystem({
      villagers: this.villagers,
      world: this.world
    });
    this.commands = new CommandSystem({
      villagers: this.villagers,
      navigation: this.navigation,
      world: this.world
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
    this.worldInteractionController = new WorldInteractionController({
      element,
      camera: this.worldScene.camera,
      villagerViews: this.villagerViews,
      selection: this.selection,
      commands: this.commands,
      world: this.world
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
    this.navigation?.update(deltaSeconds);
    this.villagerViews?.update(deltaSeconds);
    this.worldScene?.render();
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  stop() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
    this.worldInteractionController?.dispose();
    this.cameraController?.dispose();
    this.unsubscribeSelection?.();
    this.commands?.dispose();
    this.navigation?.dispose();
    this.villagerViews?.dispose();
    this.selection?.dispose();
    this.worldScene?.dispose();

    this.worldInteractionController = null;
    this.cameraController = null;
    this.unsubscribeSelection = null;
    this.commands = null;
    this.navigation = null;
    this.villagerViews = null;
    this.selection = null;
    this.worldScene = null;
    this.world = null;
    this.villagers = null;
  }
}
