import * as THREE from 'three';

const WORLD_SIZE = 90;

export class WorldScene {
  constructor({ container }) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb8d6dd);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 300);
    this.camera.position.set(18, 26, 22);
    this.camera.lookAt(this.cameraTarget);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.shadowMap.enabled = false;
    this.container.append(this.renderer.domElement);

    this.addLighting();
    this.addGround();
    this.addLandmarks();
  }

  addLighting() {
    const hemisphere = new THREE.HemisphereLight(0xe7f2ff, 0x45553a, 2.2);
    this.scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xfff1d1, 2.4);
    sun.position.set(30, 45, 20);
    this.scene.add(sun);
  }

  addGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE),
      new THREE.MeshStandardMaterial({ color: 0x789a55, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.name = 'world-ground';
    this.scene.add(ground);

    const grid = new THREE.GridHelper(WORLD_SIZE, 30, 0x50663f, 0x6f874f);
    grid.position.y = 0.015;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    this.scene.add(grid);
  }

  addLandmarks() {
    const trunkGeometry = new THREE.CylinderGeometry(0.35, 0.48, 3.4, 7);
    const crownGeometry = new THREE.ConeGeometry(1.7, 4.6, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x6f4b32, roughness: 1 });
    const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x315f34, roughness: 1 });
    const positions = [
      [-12, -10], [-17, 5], [14, -8], [18, 9], [5, 16], [-5, 18], [22, -18], [-24, -16]
    ];

    for (const [x, z] of positions) {
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, 1.7, z);
      this.scene.add(trunk);

      const crown = new THREE.Mesh(crownGeometry, crownMaterial);
      crown.position.set(x, 5.15, z);
      this.scene.add(crown);
    }
  }

  resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
