import * as THREE from 'three';

const TAP_MOVE_THRESHOLD_PX = 10;
const TOUCH_MULTI_SELECT_HOLD_MS = 360;

export class WorldInteractionController {
  constructor({ element, camera, villagerViews, selection, commands, world }) {
    if (!element || !camera || !villagerViews || !selection || !commands || !world) {
      throw new Error('WorldInteractionController requires element, camera, villagerViews, selection, commands, and world.');
    }

    this.element = element;
    this.camera = camera;
    this.villagerViews = villagerViews;
    this.selection = selection;
    this.commands = commands;
    this.world = world;
    this.pointers = new Map();
    this.raycaster = new THREE.Raycaster();
    this.pointerNdc = new THREE.Vector2();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -world.groundY);
    this.groundPoint = new THREE.Vector3();

    element.addEventListener('pointerdown', this.onPointerDown);
    element.addEventListener('pointermove', this.onPointerMove);
    element.addEventListener('pointerup', this.onPointerUp);
    element.addEventListener('pointercancel', this.onPointerCancel);
    element.addEventListener('contextmenu', this.onContextMenu);
    window.addEventListener('keydown', this.onKeyDown);
  }

  onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const record = {
      startX: event.clientX,
      startY: event.clientY,
      startedAt: performance.now(),
      moved: false,
      multiTouch: this.pointers.size > 0,
      pointerType: event.pointerType
    };

    if (this.pointers.size > 0) {
      for (const active of this.pointers.values()) active.multiTouch = true;
    }

    this.pointers.set(event.pointerId, record);
  };

  onPointerMove = (event) => {
    const record = this.pointers.get(event.pointerId);
    if (!record || record.moved) return;

    const dx = event.clientX - record.startX;
    const dy = event.clientY - record.startY;
    if ((dx * dx) + (dy * dy) > TAP_MOVE_THRESHOLD_PX * TAP_MOVE_THRESHOLD_PX) {
      record.moved = true;
    }
  };

  onPointerUp = (event) => {
    const record = this.pointers.get(event.pointerId);
    this.pointers.delete(event.pointerId);
    if (!record || record.moved || record.multiTouch) return;

    const holdDuration = performance.now() - record.startedAt;
    const modifierAdd = event.shiftKey || event.ctrlKey || event.metaKey;
    const touchHold = record.pointerType !== 'mouse' && holdDuration >= TOUCH_MULTI_SELECT_HOLD_MS;
    const additive = modifierAdd || touchHold;

    const villagerId = this.villagerViews.pickVillager({
      clientX: event.clientX,
      clientY: event.clientY,
      camera: this.camera,
      element: this.element
    });

    if (villagerId) {
      if (additive) {
        this.selection.toggle(villagerId);
      } else {
        this.selection.selectOnly(villagerId);
      }
      return;
    }

    if (touchHold) {
      this.selection.clear();
      return;
    }

    const destination = this.pickGround(event.clientX, event.clientY);
    const selectedIds = this.selection.getSelectedIds();
    if (destination && selectedIds.length > 0) {
      this.commands.issueMove({ villagerIds: selectedIds, destination });
      return;
    }

    if (!destination) this.selection.clear();
  };

  pickGround(clientX, clientY) {
    const rect = this.element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    this.pointerNdc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);

    const hit = this.raycaster.ray.intersectPlane(this.groundPlane, this.groundPoint);
    if (!hit) return null;

    const destination = { x: hit.x, y: this.world.groundY, z: hit.z };
    return this.world.isValidGroundDestination(destination) ? destination : null;
  }

  onPointerCancel = (event) => {
    this.pointers.delete(event.pointerId);
  };

  onContextMenu = (event) => {
    event.preventDefault();
  };

  onKeyDown = (event) => {
    if (event.key === 'Escape') this.selection.clear();
  };

  dispose() {
    this.element.removeEventListener('pointerdown', this.onPointerDown);
    this.element.removeEventListener('pointermove', this.onPointerMove);
    this.element.removeEventListener('pointerup', this.onPointerUp);
    this.element.removeEventListener('pointercancel', this.onPointerCancel);
    this.element.removeEventListener('contextmenu', this.onContextMenu);
    window.removeEventListener('keydown', this.onKeyDown);
    this.pointers.clear();
  }
}
