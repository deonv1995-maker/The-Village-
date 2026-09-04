import * as THREE from 'three';
import {
  getVillagerBodyProfile,
  resolveVillagerAppearanceColors
} from '../../data/villagerAppearanceCatalog.js';
import { createVillagerAnimationClips } from './VillagerAnimationLibrary.js';

const SHOE_COLOR = '#4a392d';
const EYE_COLOR = '#2b241f';

function addBone(parent, name, x = 0, y = 0, z = 0) {
  const bone = new THREE.Bone();
  bone.name = name;
  bone.position.set(x, y, z);
  parent.add(bone);
  return bone;
}

function stableNumber(value) {
  return Number(value).toFixed(4);
}

export class VillagerAssetFactory {
  constructor() {
    this.geometryCache = new Map();
    this.materialCache = new Map();
    this.animationClips = createVillagerAnimationClips();
  }

  create(appearance) {
    const profile = getVillagerBodyProfile(appearance.bodyProfileId);
    const colors = resolveVillagerAppearanceColors(appearance);
    const root = new THREE.Group();
    root.name = 'VillagerAsset';
    root.userData.isVillagerAsset = true;
    root.userData.bodyProfileId = profile.id;

    const { bones, boneList, rootBone } = this.createArmature(profile);
    root.add(rootBone);

    const materials = {
      skin: this.getStandardMaterial(colors.skin),
      hair: this.getStandardMaterial(colors.hair),
      primary: this.getStandardMaterial(colors.primary),
      secondary: this.getStandardMaterial(colors.secondary),
      shoes: this.getStandardMaterial(SHOE_COLOR),
      eyes: this.getBasicMaterial(EYE_COLOR)
    };

    this.addBody(root, bones, profile, materials);
    this.addOutfit(root, bones, profile, materials, appearance.outfitStyle);
    this.addHair(root, bones, profile, materials.hair, appearance.hairStyle);
    this.addFace(bones.Head, profile, materials);

    const skeleton = new THREE.Skeleton(boneList);
    const mixer = new THREE.AnimationMixer(root);
    const actions = new Map(
      Object.entries(this.animationClips).map(([name, clip]) => [name, mixer.clipAction(clip)])
    );

    let activeAction = actions.get('idle');
    activeAction?.play();

    return {
      root,
      skeleton,
      bones,
      setAnimation(name, fadeSeconds = 0.16) {
        const nextAction = actions.get(name);
        if (!nextAction || nextAction === activeAction) return;
        nextAction.reset().play();
        activeAction?.crossFadeTo(nextAction, fadeSeconds, true);
        activeAction = nextAction;
      },
      update(deltaSeconds) {
        mixer.update(deltaSeconds);
      },
      dispose() {
        mixer.stopAllAction();
        mixer.uncacheRoot(root);
        skeleton.dispose();
      }
    };
  }

  createArmature(profile) {
    const rootBone = new THREE.Bone();
    rootBone.name = 'Root';

    const hipsHeight = profile.footHeight + profile.lowerLegLength + profile.upperLegLength;
    const hips = addBone(rootBone, 'Hips', 0, hipsHeight, 0);
    const spine = addBone(hips, 'Spine', 0, profile.torsoLength * 0.42, 0);
    const chest = addBone(spine, 'Chest', 0, profile.torsoLength * 0.40, 0);
    const neck = addBone(chest, 'Neck', 0, profile.torsoLength * 0.18, 0);
    const head = addBone(neck, 'Head', 0, profile.neckLength + profile.headRadius, 0);

    const shoulderY = profile.torsoLength * 0.10;
    const leftUpperArm = addBone(
      chest,
      'LeftUpperArm',
      -profile.shoulderWidth * 0.50,
      shoulderY,
      0
    );
    const leftLowerArm = addBone(leftUpperArm, 'LeftLowerArm', 0, -profile.upperArmLength, 0);
    const leftHand = addBone(leftLowerArm, 'LeftHand', 0, -profile.forearmLength, 0);

    const rightUpperArm = addBone(
      chest,
      'RightUpperArm',
      profile.shoulderWidth * 0.50,
      shoulderY,
      0
    );
    const rightLowerArm = addBone(rightUpperArm, 'RightLowerArm', 0, -profile.upperArmLength, 0);
    const rightHand = addBone(rightLowerArm, 'RightHand', 0, -profile.forearmLength, 0);

    const legOffset = profile.hipWidth * 0.25;
    const leftUpperLeg = addBone(hips, 'LeftUpperLeg', -legOffset, 0, 0);
    const leftLowerLeg = addBone(leftUpperLeg, 'LeftLowerLeg', 0, -profile.upperLegLength, 0);
    const leftFoot = addBone(leftLowerLeg, 'LeftFoot', 0, -profile.lowerLegLength, 0);

    const rightUpperLeg = addBone(hips, 'RightUpperLeg', legOffset, 0, 0);
    const rightLowerLeg = addBone(rightUpperLeg, 'RightLowerLeg', 0, -profile.upperLegLength, 0);
    const rightFoot = addBone(rightLowerLeg, 'RightFoot', 0, -profile.lowerLegLength, 0);

    const bones = {
      Root: rootBone,
      Hips: hips,
      Spine: spine,
      Chest: chest,
      Neck: neck,
      Head: head,
      LeftUpperArm: leftUpperArm,
      LeftLowerArm: leftLowerArm,
      LeftHand: leftHand,
      RightUpperArm: rightUpperArm,
      RightLowerArm: rightLowerArm,
      RightHand: rightHand,
      LeftUpperLeg: leftUpperLeg,
      LeftLowerLeg: leftLowerLeg,
      LeftFoot: leftFoot,
      RightUpperLeg: rightUpperLeg,
      RightLowerLeg: rightLowerLeg,
      RightFoot: rightFoot
    };

    return { bones, boneList: Object.values(bones), rootBone };
  }

  addBody(root, bones, profile, materials) {
    const head = this.createMesh(
      this.getGeometry(
        `head:${stableNumber(profile.headRadius)}`,
        () => new THREE.SphereGeometry(profile.headRadius, 12, 8)
      ),
      materials.skin
    );
    head.scale.set(profile.headWidthScale, 1.04, 0.96);
    bones.Head.add(head);

    const neckRadius = profile.limbRadius * 0.62;
    const neck = this.createMesh(
      this.getCylinderGeometry(neckRadius, profile.neckLength, 8),
      materials.skin
    );
    neck.position.y = profile.neckLength * 0.5;
    bones.Neck.add(neck);

    const armRadius = profile.limbRadius * 0.78;
    this.addLimbSegment(bones.LeftUpperArm, armRadius, profile.upperArmLength, materials.skin);
    this.addLimbSegment(bones.RightUpperArm, armRadius, profile.upperArmLength, materials.skin);
    this.addLimbSegment(bones.LeftLowerArm, armRadius * 0.88, profile.forearmLength, materials.skin);
    this.addLimbSegment(bones.RightLowerArm, armRadius * 0.88, profile.forearmLength, materials.skin);

    const handRadius = profile.limbRadius * 0.78;
    this.addHand(bones.LeftHand, handRadius, materials.skin);
    this.addHand(bones.RightHand, handRadius, materials.skin);

    const legRadius = profile.limbRadius;
    this.addLimbSegment(bones.LeftUpperLeg, legRadius, profile.upperLegLength, materials.skin);
    this.addLimbSegment(bones.RightUpperLeg, legRadius, profile.upperLegLength, materials.skin);
    this.addLimbSegment(bones.LeftLowerLeg, legRadius * 0.88, profile.lowerLegLength, materials.skin);
    this.addLimbSegment(bones.RightLowerLeg, legRadius * 0.88, profile.lowerLegLength, materials.skin);

    this.addFoot(bones.LeftFoot, profile, materials.shoes);
    this.addFoot(bones.RightFoot, profile, materials.shoes);

    const torso = this.createTorsoMesh(profile, materials.skin, 0.96);
    torso.position.y = profile.torsoLength * 0.5;
    bones.Hips.add(torso);

    root.userData.height =
      profile.footHeight +
      profile.lowerLegLength +
      profile.upperLegLength +
      profile.torsoLength +
      profile.neckLength +
      profile.headRadius * 2;
  }

  addOutfit(root, bones, profile, materials, outfitStyle) {
    const torso = this.createTorsoMesh(profile, materials.primary, 1.03);
    torso.position.y = profile.torsoLength * 0.5;
    bones.Hips.add(torso);

    switch (outfitStyle) {
      case 'field_vest':
        this.addSleeves(bones, profile, materials.secondary, 0.72);
        this.addPants(bones, profile, materials.secondary);
        this.addVest(bones.Hips, profile, materials.primary);
        this.addBelt(bones.Hips, profile, materials.secondary);
        break;
      case 'long_dress':
        this.addSleeves(bones, profile, materials.primary, 0.72);
        this.addSkirt(bones.Hips, profile, materials.primary, 0.58);
        this.addBelt(bones.Hips, profile, materials.secondary);
        break;
      case 'apron_dress':
        torso.material = materials.secondary;
        this.addSleeves(bones, profile, materials.secondary, 0.70);
        this.addSkirt(bones.Hips, profile, materials.secondary, 0.56);
        this.addApron(bones.Hips, profile, materials.primary);
        this.addBelt(bones.Hips, profile, materials.primary);
        break;
      case 'child_dress':
        this.addSleeves(bones, profile, materials.primary, 0.48);
        this.addSkirt(bones.Hips, profile, materials.primary, 0.36);
        this.addBelt(bones.Hips, profile, materials.secondary);
        break;
      case 'child_tunic':
        this.addSleeves(bones, profile, materials.primary, 0.48);
        this.addPants(bones, profile, materials.secondary, 0.92);
        this.addTunicFlare(bones.Hips, profile, materials.primary);
        this.addBelt(bones.Hips, profile, materials.secondary);
        break;
      case 'work_tunic':
      default:
        this.addSleeves(bones, profile, materials.primary, 0.62);
        this.addPants(bones, profile, materials.secondary);
        this.addTunicFlare(bones.Hips, profile, materials.primary);
        this.addBelt(bones.Hips, profile, materials.secondary);
        break;
    }

    root.userData.outfitStyle = outfitStyle;
  }

  addHair(root, bones, profile, material, hairStyle) {
    const headRadius = profile.headRadius;
    const capGeometry = this.getGeometry(
      `hair-cap:${stableNumber(headRadius)}`,
      () => new THREE.SphereGeometry(
        headRadius * 1.04,
        12,
        7,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.60
      )
    );
    const cap = this.createMesh(capGeometry, material);
    cap.position.y = headRadius * 0.08;
    cap.scale.x = profile.headWidthScale * 1.01;
    bones.Head.add(cap);

    switch (hairStyle) {
      case 'side_part':
        this.addHairSidePart(bones.Head, profile, material);
        break;
      case 'messy':
        this.addMessyHair(bones.Head, profile, material);
        break;
      case 'bun':
        this.addHairBun(bones.Head, profile, material);
        break;
      case 'braid':
        this.addHairBraid(bones.Head, profile, material);
        break;
      case 'shoulder':
        this.addShoulderHair(bones.Head, profile, material);
        break;
      case 'cropped':
      default:
        break;
    }

    root.userData.hairStyle = hairStyle;
  }

  addFace(headBone, profile, materials) {
    const eyeRadius = profile.headRadius * 0.115;
    const eyeGeometry = this.getGeometry(
      `eye:${stableNumber(eyeRadius)}`,
      () => new THREE.SphereGeometry(eyeRadius, 7, 5)
    );
    const eyeX = profile.headRadius * 0.38;
    const eyeY = profile.headRadius * 0.08;
    const eyeZ = profile.headRadius * 0.89;

    const leftEye = this.createMesh(eyeGeometry, materials.eyes, false);
    leftEye.position.set(-eyeX, eyeY, eyeZ);
    headBone.add(leftEye);

    const rightEye = this.createMesh(eyeGeometry, materials.eyes, false);
    rightEye.position.set(eyeX, eyeY, eyeZ);
    headBone.add(rightEye);

    const noseGeometry = this.getGeometry(
      `nose:${stableNumber(profile.headRadius)}`,
      () => new THREE.ConeGeometry(profile.headRadius * 0.07, profile.headRadius * 0.18, 6)
    );
    const nose = this.createMesh(noseGeometry, materials.skin, false);
    nose.rotation.x = Math.PI * 0.5;
    nose.position.set(0, -profile.headRadius * 0.04, profile.headRadius * 0.98);
    headBone.add(nose);

    const earGeometry = this.getGeometry(
      `ear:${stableNumber(profile.headRadius)}`,
      () => new THREE.SphereGeometry(profile.headRadius * 0.16, 7, 5)
    );
    for (const side of [-1, 1]) {
      const ear = this.createMesh(earGeometry, materials.skin, false);
      ear.scale.set(0.58, 0.88, 0.52);
      ear.position.set(side * profile.headRadius * profile.headWidthScale * 0.98, -profile.headRadius * 0.02, 0);
      headBone.add(ear);
    }

    const mouthGeometry = this.getGeometry(
      `mouth:${stableNumber(profile.headRadius)}`,
      () => new THREE.BoxGeometry(
        profile.headRadius * 0.30,
        profile.headRadius * 0.035,
        profile.headRadius * 0.025
      )
    );
    const mouth = this.createMesh(mouthGeometry, materials.eyes, false);
    mouth.position.set(0, -profile.headRadius * 0.25, profile.headRadius * 0.955);
    headBone.add(mouth);
  }

  createTorsoMesh(profile, material, scaleMultiplier) {
    const bottomRatio = Math.max(0.68, Math.min(1.16, profile.hipWidth / profile.shoulderWidth));
    const geometry = this.getGeometry(
      `torso:${stableNumber(bottomRatio)}`,
      () => new THREE.CylinderGeometry(0.5, 0.5 * bottomRatio, 1, 8)
    );
    const torso = this.createMesh(geometry, material);
    torso.scale.set(
      profile.shoulderWidth * scaleMultiplier,
      profile.torsoLength * scaleMultiplier,
      profile.torsoDepth * scaleMultiplier
    );
    return torso;
  }

  addLimbSegment(bone, radius, length, material) {
    const mesh = this.createMesh(this.getCylinderGeometry(radius, length, 8), material);
    mesh.position.y = -length * 0.5;
    bone.add(mesh);
  }

  addHand(bone, radius, material) {
    const geometry = this.getGeometry(
      `hand:${stableNumber(radius)}`,
      () => new THREE.SphereGeometry(radius, 8, 6)
    );
    const hand = this.createMesh(geometry, material);
    hand.scale.set(0.92, 1.18, 0.78);
    hand.position.y = -radius * 0.55;
    bone.add(hand);
  }

  addFoot(bone, profile, material) {
    const geometry = this.getGeometry(
      `foot:${stableNumber(profile.footWidth)}:${stableNumber(profile.footHeight)}:${stableNumber(profile.footLength)}`,
      () => new THREE.BoxGeometry(profile.footWidth, profile.footHeight, profile.footLength)
    );
    const foot = this.createMesh(geometry, material);
    foot.position.set(0, -profile.footHeight * 0.5, profile.footLength * 0.18);
    bone.add(foot);
  }

  addSleeves(bones, profile, material, coverage) {
    const sleeveLength = profile.upperArmLength * coverage;
    const sleeveRadius = profile.limbRadius * 0.86;
    for (const bone of [bones.LeftUpperArm, bones.RightUpperArm]) {
      const sleeve = this.createMesh(
        this.getCylinderGeometry(sleeveRadius, sleeveLength, 8),
        material
      );
      sleeve.position.y = -sleeveLength * 0.5;
      bone.add(sleeve);
    }
  }

  addPants(bones, profile, material, lengthScale = 1) {
    const upperRadius = profile.limbRadius * 1.10;
    const lowerRadius = profile.limbRadius * 0.97;
    const upperLength = profile.upperLegLength * Math.min(lengthScale, 1);
    const lowerLength = profile.lowerLegLength * lengthScale;

    for (const bone of [bones.LeftUpperLeg, bones.RightUpperLeg]) {
      const trouser = this.createMesh(
        this.getCylinderGeometry(upperRadius, upperLength, 8),
        material
      );
      trouser.position.y = -upperLength * 0.5;
      bone.add(trouser);
    }

    for (const bone of [bones.LeftLowerLeg, bones.RightLowerLeg]) {
      const trouser = this.createMesh(
        this.getCylinderGeometry(lowerRadius, lowerLength, 8),
        material
      );
      trouser.position.y = -lowerLength * 0.5;
      bone.add(trouser);
    }
  }

  addBelt(hipsBone, profile, material) {
    const beltHeight = Math.max(0.035, profile.torsoLength * 0.075);
    const beltGeometry = this.getGeometry(
      `belt:${stableNumber(profile.hipWidth)}:${stableNumber(profile.torsoDepth)}:${stableNumber(beltHeight)}`,
      () => new THREE.BoxGeometry(profile.hipWidth * 1.04, beltHeight, profile.torsoDepth * 1.08)
    );
    const belt = this.createMesh(beltGeometry, material);
    belt.position.y = beltHeight * 0.55;
    hipsBone.add(belt);
  }

  addVest(hipsBone, profile, material) {
    const geometry = this.getGeometry(
      `vest:${stableNumber(profile.shoulderWidth)}:${stableNumber(profile.torsoLength)}:${stableNumber(profile.torsoDepth)}`,
      () => new THREE.BoxGeometry(
        profile.shoulderWidth * 0.76,
        profile.torsoLength * 0.70,
        profile.torsoDepth * 1.08
      )
    );
    const vest = this.createMesh(geometry, material);
    vest.position.set(0, profile.torsoLength * 0.60, profile.torsoDepth * 0.04);
    hipsBone.add(vest);
  }

  addSkirt(hipsBone, profile, material, legCoverage) {
    const length = profile.upperLegLength * legCoverage + profile.lowerLegLength * 0.35;
    const topRadius = profile.hipWidth * 0.48;
    const bottomRadius = topRadius * 1.28;
    const geometry = this.getGeometry(
      `skirt:${stableNumber(topRadius)}:${stableNumber(bottomRadius)}:${stableNumber(length)}`,
      () => new THREE.CylinderGeometry(topRadius, bottomRadius, length, 10)
    );
    const skirt = this.createMesh(geometry, material);
    skirt.scale.z = Math.max(0.72, profile.torsoDepth / profile.hipWidth);
    skirt.position.y = -length * 0.47;
    hipsBone.add(skirt);
  }

  addTunicFlare(hipsBone, profile, material) {
    const length = Math.min(profile.upperLegLength * 0.34, profile.torsoLength * 0.28);
    const topRadius = profile.hipWidth * 0.46;
    const bottomRadius = topRadius * 1.16;
    const geometry = this.getGeometry(
      `tunic-flare:${stableNumber(topRadius)}:${stableNumber(length)}`,
      () => new THREE.CylinderGeometry(topRadius, bottomRadius, length, 8)
    );
    const flare = this.createMesh(geometry, material);
    flare.scale.z = Math.max(0.72, profile.torsoDepth / profile.hipWidth);
    flare.position.y = -length * 0.43;
    hipsBone.add(flare);
  }

  addApron(hipsBone, profile, material) {
    const depth = Math.max(0.012, profile.torsoDepth * 0.055);
    const bibWidth = profile.shoulderWidth * 0.56;
    const bibHeight = profile.torsoLength * 0.48;
    const bibGeometry = this.getGeometry(
      `apron-bib:${stableNumber(bibWidth)}:${stableNumber(bibHeight)}:${stableNumber(depth)}`,
      () => new THREE.BoxGeometry(bibWidth, bibHeight, depth)
    );
    const bib = this.createMesh(bibGeometry, material);
    bib.position.set(0, profile.torsoLength * 0.53, profile.torsoDepth * 0.535);
    hipsBone.add(bib);

    const skirtWidth = profile.hipWidth * 0.78;
    const skirtHeight = profile.upperLegLength * 0.58;
    const skirtGeometry = this.getGeometry(
      `apron-skirt:${stableNumber(skirtWidth)}:${stableNumber(skirtHeight)}:${stableNumber(depth)}`,
      () => new THREE.BoxGeometry(skirtWidth, skirtHeight, depth)
    );
    const skirtPanel = this.createMesh(skirtGeometry, material);
    skirtPanel.position.set(0, -skirtHeight * 0.30, profile.torsoDepth * 0.555);
    hipsBone.add(skirtPanel);
  }

  addHairSidePart(headBone, profile, material) {
    const radius = profile.headRadius;
    const geometry = this.getGeometry(
      `hair-side-part:${stableNumber(radius)}`,
      () => new THREE.BoxGeometry(radius * 0.72, radius * 0.30, radius * 0.42)
    );
    const tuft = this.createMesh(geometry, material);
    tuft.rotation.z = -0.24;
    tuft.position.set(-radius * 0.22, radius * 0.87, radius * 0.20);
    headBone.add(tuft);
  }

  addMessyHair(headBone, profile, material) {
    const radius = profile.headRadius;
    const geometry = this.getGeometry(
      `hair-spike:${stableNumber(radius)}`,
      () => new THREE.ConeGeometry(radius * 0.20, radius * 0.54, 6)
    );
    const offsets = [
      [-0.30, 0.92, 0.02, -0.24],
      [0.02, 1.00, -0.02, 0.04],
      [0.30, 0.90, 0.03, 0.26]
    ];
    for (const [x, y, z, rotationZ] of offsets) {
      const spike = this.createMesh(geometry, material);
      spike.position.set(radius * x, radius * y, radius * z);
      spike.rotation.z = rotationZ;
      headBone.add(spike);
    }
  }

  addHairBun(headBone, profile, material) {
    const radius = profile.headRadius;
    const geometry = this.getGeometry(
      `hair-bun:${stableNumber(radius)}`,
      () => new THREE.SphereGeometry(radius * 0.48, 9, 7)
    );
    const bun = this.createMesh(geometry, material);
    bun.position.set(0, radius * 0.42, -radius * 0.88);
    headBone.add(bun);
  }

  addHairBraid(headBone, profile, material) {
    const radius = profile.headRadius;
    const beadGeometry = this.getGeometry(
      `hair-braid-bead:${stableNumber(radius)}`,
      () => new THREE.SphereGeometry(radius * 0.22, 8, 6)
    );
    for (let index = 0; index < 4; index += 1) {
      const bead = this.createMesh(beadGeometry, material);
      bead.scale.set(0.86, 1.18, 0.80);
      bead.position.set(
        radius * 0.62,
        -radius * (0.06 + index * 0.34),
        -radius * 0.24
      );
      headBone.add(bead);
    }
  }

  addShoulderHair(headBone, profile, material) {
    const radius = profile.headRadius;
    const geometry = this.getGeometry(
      `hair-shoulder:${stableNumber(radius)}`,
      () => new THREE.BoxGeometry(radius * 0.42, radius * 1.28, radius * 0.34)
    );
    for (const side of [-1, 1]) {
      const panel = this.createMesh(geometry, material);
      panel.position.set(side * radius * 0.70, -radius * 0.38, radius * 0.04);
      panel.rotation.z = side * -0.07;
      headBone.add(panel);
    }
  }

  getCylinderGeometry(radius, length, radialSegments) {
    const key = `cylinder:${stableNumber(radius)}:${stableNumber(length)}:${radialSegments}`;
    return this.getGeometry(
      key,
      () => new THREE.CylinderGeometry(radius, radius * 0.92, length, radialSegments)
    );
  }

  getGeometry(key, createGeometry) {
    if (!this.geometryCache.has(key)) {
      this.geometryCache.set(key, createGeometry());
    }
    return this.geometryCache.get(key);
  }

  getStandardMaterial(color) {
    const key = `standard:${color}`;
    if (!this.materialCache.has(key)) {
      this.materialCache.set(
        key,
        new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0 })
      );
    }
    return this.materialCache.get(key);
  }

  getBasicMaterial(color) {
    const key = `basic:${color}`;
    if (!this.materialCache.has(key)) {
      this.materialCache.set(key, new THREE.MeshBasicMaterial({ color }));
    }
    return this.materialCache.get(key);
  }

  createMesh(geometry, material, castShadow = true) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = false;
    return mesh;
  }

  dispose() {
    for (const geometry of this.geometryCache.values()) geometry.dispose();
    for (const material of this.materialCache.values()) material.dispose();
    this.geometryCache.clear();
    this.materialCache.clear();
  }
}
