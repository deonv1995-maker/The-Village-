import * as THREE from 'three';

const MIN_DISTANCE = 12;
const MAX_DISTANCE = 48;
const PAN_SCALE = 0.055;

export class CameraController {
  constructor({ element, camera, target }) {
    this.element = element;
    this.camera = camera;
    this.target = target;
    this.pointers = new Map();
    this.lastPinchDistance = null;
    this.pendingPan = new THREE.Vector2();
    this.pendingZoom = 0;

    element.addEventListener('pointerdown', this.onPointerDown);
    element.addEventListener('pointermove', this.onPointerMove);
    element.addEventListener('pointerup', this.onPointerUp);
    element.addEventListener('pointercancel', this.onPointerUp);
    element.addEventListener('wheel', this.onWheel, { passive: false });
  }

  onPointerDown = (event) => {
    this.element.setPointerCapture?.(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.updatePinchBaseline();
  };

  onPointerMove = (event) => {
    const previous = this.pointers.get(event.pointerId);
    if (!previous) return;

    const current = { x: event.clientX, y: event.clientY };
    this.pointers.set(event.pointerId, current);

    if (this.pointers.size === 1) {
      this.pendingPan.x += current.x - previous.x;
      this.pendingPan.y += current.y - previous.y;
      return;
    }

    if (this.pointers.size === 2) {
      const distance = this.getPinchDistance();
      if (this.lastPinchDistance !== null) {
        this.pendingZoom += (this.lastPinchDistance - distance) * 0.035;
      }
      this.lastPinchDistance = distance;
    }
  };

  onPointerUp = (event) => {
    this.pointers.delete(event.pointerId);
    this.updatePinchBaseline();
  };

  onWheel = (event) => {
    event.preventDefault();
    this.pendingZoom += event.deltaY * 0.012;
  };

  updatePinchBaseline() {
    this.lastPinchDistance = this.pointers.size === 2 ? this.getPinchDistance() : null;
  }

  getPinchDistance() {
    const [a, b] = [...this.pointers.values()];
    if (!a || !b) return 0;
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  update() {
    if (this.pendingPan.lengthSq() > 0) {
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, this.camera.up).normalize();
      const distance = this.camera.position.distanceTo(this.target);
      const scale = PAN_SCALE * (distance / 24);
      const movement = right.multiplyScalar(-this.pendingPan.x * scale)
        .add(forward.multiplyScalar(this.pendingPan.y * scale));

      this.target.add(movement);
      this.camera.position.add(movement);
      this.pendingPan.set(0, 0);
    }

    if (this.pendingZoom !== 0) {
      const offset = this.camera.position.clone().sub(this.target);
      const currentDistance = offset.length();
      const nextDistance = THREE.MathUtils.clamp(currentDistance + this.pendingZoom, MIN_DISTANCE, MAX_DISTANCE);
      offset.setLength(nextDistance);
      this.camera.position.copy(this.target).add(offset);
      this.camera.lookAt(this.target);
      this.pendingZoom = 0;
    }
  }

  dispose() {
    this.element.removeEventListener('pointerdown', this.onPointerDown);
    this.element.removeEventListener('pointermove', this.onPointerMove);
    this.element.removeEventListener('pointerup', this.onPointerUp);
    this.element.removeEventListener('pointercancel', this.onPointerUp);
    this.element.removeEventListener('wheel', this.onWheel);
  }
}
