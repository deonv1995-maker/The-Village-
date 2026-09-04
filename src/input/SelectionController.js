const TAP_MOVE_THRESHOLD_PX = 10;
const TOUCH_MULTI_SELECT_HOLD_MS = 360;

export class SelectionController {
  constructor({ element, camera, villagerViews, selection }) {
    if (!element || !camera || !villagerViews || !selection) {
      throw new Error('SelectionController requires element, camera, villagerViews, and selection.');
    }

    this.element = element;
    this.camera = camera;
    this.villagerViews = villagerViews;
    this.selection = selection;
    this.pointers = new Map();

    element.addEventListener('pointerdown', this.onPointerDown);
    element.addEventListener('pointermove', this.onPointerMove);
    element.addEventListener('pointerup', this.onPointerUp);
    element.addEventListener('pointercancel', this.onPointerCancel);
    element.addEventListener('contextmenu', this.onContextMenu);
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
    const touchHoldAdd = record.pointerType !== 'mouse' && holdDuration >= TOUCH_MULTI_SELECT_HOLD_MS;
    const additive = modifierAdd || touchHoldAdd;

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

    if (!additive) this.selection.clear();
  };

  onPointerCancel = (event) => {
    this.pointers.delete(event.pointerId);
  };

  onContextMenu = (event) => {
    event.preventDefault();
  };

  dispose() {
    this.element.removeEventListener('pointerdown', this.onPointerDown);
    this.element.removeEventListener('pointermove', this.onPointerMove);
    this.element.removeEventListener('pointerup', this.onPointerUp);
    this.element.removeEventListener('pointercancel', this.onPointerCancel);
    this.element.removeEventListener('contextmenu', this.onContextMenu);
    this.pointers.clear();
  }
}
