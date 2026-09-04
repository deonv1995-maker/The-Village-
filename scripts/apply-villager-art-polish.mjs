import fs from 'node:fs';

function replaceOnce(source, oldText, newText, label) {
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Polish patch target not found: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) {
    throw new Error(`Polish patch target is ambiguous: ${label}`);
  }
  return source.replace(oldText, newText);
}

const factoryPath = 'src/rendering/villagers/VillagerAssetFactory.js';
let factory = fs.readFileSync(factoryPath, 'utf8');

factory = replaceOnce(
  factory,
  `      case 'child_tunic':\n        this.addSleeves(bones, profile, materials.primary, 0.48);\n        this.addPants(bones, profile, materials.secondary, 0.92);\n        this.addTunicFlare(bones.Hips, profile, materials.primary);\n        this.addBelt(bones.Hips, profile, materials.secondary);\n        break;`,
  `      case 'child_dress':\n        this.addSleeves(bones, profile, materials.primary, 0.48);\n        this.addSkirt(bones.Hips, profile, materials.primary, 0.36);\n        this.addBelt(bones.Hips, profile, materials.secondary);\n        break;\n      case 'child_tunic':\n        this.addSleeves(bones, profile, materials.primary, 0.48);\n        this.addPants(bones, profile, materials.secondary, 0.92);\n        this.addTunicFlare(bones.Hips, profile, materials.primary);\n        this.addBelt(bones.Hips, profile, materials.secondary);\n        break;`,
  'child dress outfit'
);

factory = replaceOnce(
  factory,
  `    const eyeRadius = profile.headRadius * 0.105;`,
  `    const eyeRadius = profile.headRadius * 0.115;`,
  'eye scale'
);

factory = replaceOnce(
  factory,
  `    nose.position.set(0, -profile.headRadius * 0.04, profile.headRadius * 0.98);\n    headBone.add(nose);`,
  `    nose.position.set(0, -profile.headRadius * 0.04, profile.headRadius * 0.98);\n    headBone.add(nose);\n\n    const earGeometry = this.getGeometry(\n      \`ear:\${stableNumber(profile.headRadius)}\`,\n      () => new THREE.SphereGeometry(profile.headRadius * 0.16, 7, 5)\n    );\n    for (const side of [-1, 1]) {\n      const ear = this.createMesh(earGeometry, materials.skin, false);\n      ear.scale.set(0.58, 0.88, 0.52);\n      ear.position.set(side * profile.headRadius * profile.headWidthScale * 0.98, -profile.headRadius * 0.02, 0);\n      headBone.add(ear);\n    }\n\n    const mouthGeometry = this.getGeometry(\n      \`mouth:\${stableNumber(profile.headRadius)}\`,\n      () => new THREE.BoxGeometry(\n        profile.headRadius * 0.30,\n        profile.headRadius * 0.035,\n        profile.headRadius * 0.025\n      )\n    );\n    const mouth = this.createMesh(mouthGeometry, materials.eyes, false);\n    mouth.position.set(0, -profile.headRadius * 0.25, profile.headRadius * 0.955);\n    headBone.add(mouth);`,
  'face details'
);

factory = replaceOnce(
  factory,
  `  addApron(hipsBone, profile, material) {\n    const width = profile.hipWidth * 0.72;\n    const height = profile.upperLegLength * 0.62;\n    const depth = Math.max(0.012, profile.torsoDepth * 0.055);\n    const geometry = this.getGeometry(\n      \`apron:\${stableNumber(width)}:\${stableNumber(height)}:\${stableNumber(depth)}\`,\n      () => new THREE.BoxGeometry(width, height, depth)\n    );\n    const apron = this.createMesh(geometry, material);\n    apron.position.set(0, -height * 0.30, profile.torsoDepth * 0.55);\n    hipsBone.add(apron);\n  }`,
  `  addApron(hipsBone, profile, material) {\n    const depth = Math.max(0.012, profile.torsoDepth * 0.055);\n    const bibWidth = profile.shoulderWidth * 0.56;\n    const bibHeight = profile.torsoLength * 0.48;\n    const bibGeometry = this.getGeometry(\n      \`apron-bib:\${stableNumber(bibWidth)}:\${stableNumber(bibHeight)}:\${stableNumber(depth)}\`,\n      () => new THREE.BoxGeometry(bibWidth, bibHeight, depth)\n    );\n    const bib = this.createMesh(bibGeometry, material);\n    bib.position.set(0, profile.torsoLength * 0.53, profile.torsoDepth * 0.535);\n    hipsBone.add(bib);\n\n    const skirtWidth = profile.hipWidth * 0.78;\n    const skirtHeight = profile.upperLegLength * 0.58;\n    const skirtGeometry = this.getGeometry(\n      \`apron-skirt:\${stableNumber(skirtWidth)}:\${stableNumber(skirtHeight)}:\${stableNumber(depth)}\`,\n      () => new THREE.BoxGeometry(skirtWidth, skirtHeight, depth)\n    );\n    const skirtPanel = this.createMesh(skirtGeometry, material);\n    skirtPanel.position.set(0, -skirtHeight * 0.30, profile.torsoDepth * 0.555);\n    hipsBone.add(skirtPanel);\n  }`,
  'apron silhouette'
);

factory = replaceOnce(
  factory,
  `      () => new THREE.BoxGeometry(radius * 0.62, radius * 0.24, radius * 0.34)\n    );\n    const tuft = this.createMesh(geometry, material);\n    tuft.rotation.z = -0.22;\n    tuft.position.set(-radius * 0.24, radius * 0.80, radius * 0.14);`,
  `      () => new THREE.BoxGeometry(radius * 0.72, radius * 0.30, radius * 0.42)\n    );\n    const tuft = this.createMesh(geometry, material);\n    tuft.rotation.z = -0.24;\n    tuft.position.set(-radius * 0.22, radius * 0.87, radius * 0.20);`,
  'side part silhouette'
);

factory = replaceOnce(
  factory,
  `      () => new THREE.ConeGeometry(radius * 0.16, radius * 0.46, 6)`,
  `      () => new THREE.ConeGeometry(radius * 0.20, radius * 0.54, 6)`,
  'messy hair scale'
);

factory = replaceOnce(
  factory,
  `      () => new THREE.SphereGeometry(radius * 0.42, 9, 7)\n    );\n    const bun = this.createMesh(geometry, material);\n    bun.position.set(0, radius * 0.35, -radius * 0.90);`,
  `      () => new THREE.SphereGeometry(radius * 0.48, 9, 7)\n    );\n    const bun = this.createMesh(geometry, material);\n    bun.position.set(0, radius * 0.42, -radius * 0.88);`,
  'bun silhouette'
);

factory = replaceOnce(
  factory,
  `        radius * 0.34,\n        -radius * (0.18 + index * 0.32),\n        -radius * 0.82`,
  `        radius * 0.62,\n        -radius * (0.06 + index * 0.34),\n        -radius * 0.24`,
  'braid placement'
);

factory = replaceOnce(
  factory,
  `      () => new THREE.BoxGeometry(radius * 0.34, radius * 1.15, radius * 0.30)\n    );\n    for (const side of [-1, 1]) {\n      const panel = this.createMesh(geometry, material);\n      panel.position.set(side * radius * 0.74, -radius * 0.34, -radius * 0.12);`,
  `      () => new THREE.BoxGeometry(radius * 0.42, radius * 1.28, radius * 0.34)\n    );\n    for (const side of [-1, 1]) {\n      const panel = this.createMesh(geometry, material);\n      panel.position.set(side * radius * 0.70, -radius * 0.38, radius * 0.04);`,
  'shoulder hair silhouette'
);

fs.writeFileSync(factoryPath, factory);

const catalogPath = 'src/data/villagerAppearanceCatalog.js';
let catalog = fs.readFileSync(catalogPath, 'utf8');
const replacements = [
  ['shoulderWidth: 0.58,\n    hipWidth: 0.39,\n    torsoDepth: 0.27,\n    torsoLength: 0.57,', 'shoulderWidth: 0.61,\n    hipWidth: 0.40,\n    torsoDepth: 0.29,\n    torsoLength: 0.58,', 'male A silhouette'],
  ['limbRadius: 0.090,', 'limbRadius: 0.094,', 'male A limb weight'],
  ['shoulderWidth: 0.51,\n    hipWidth: 0.36,\n    torsoDepth: 0.24,\n    torsoLength: 0.55,\n    upperLegLength: 0.39,\n    lowerLegLength: 0.39,', 'shoulderWidth: 0.48,\n    hipWidth: 0.35,\n    torsoDepth: 0.23,\n    torsoLength: 0.57,\n    upperLegLength: 0.41,\n    lowerLegLength: 0.40,', 'male B silhouette'],
  ['limbRadius: 0.075,', 'limbRadius: 0.070,', 'male B limb weight'],
  ["  'child_tunic'\n]);", "  'child_tunic',\n  'child_dress'\n]);", 'child dress catalog'],
  ["    hairStyle: 'side_part',", "    hairStyle: 'messy',", 'male B hair'],
  ["    hairStyle: 'braid',\n    hairColor: 'flax',", "    hairStyle: 'braid',\n    hairColor: 'flax',", 'braid preset check'],
  ["    outfitStyle: 'child_tunic',\n    primaryColor: 'river',", "    outfitStyle: 'child_dress',\n    primaryColor: 'river',", 'girl dress preset']
];
for (const [oldText, newText, label] of replacements) {
  catalog = replaceOnce(catalog, oldText, newText, label);
}

catalog = catalog
  .replace('torsoLength: 0.39,\n    upperLegLength: 0.275,\n    lowerLegLength: 0.275,\n    upperArmLength: 0.225,\n    forearmLength: 0.205,\n    limbRadius: 0.052,\n    headRadius: 0.137,', 'torsoLength: 0.37,\n    upperLegLength: 0.26,\n    lowerLegLength: 0.265,\n    upperArmLength: 0.215,\n    forearmLength: 0.195,\n    limbRadius: 0.050,\n    headRadius: 0.142,')
  .replace('torsoLength: 0.38,\n    upperLegLength: 0.265,\n    lowerLegLength: 0.265,\n    upperArmLength: 0.215,\n    forearmLength: 0.195,\n    limbRadius: 0.049,\n    headRadius: 0.135,', 'torsoLength: 0.36,\n    upperLegLength: 0.255,\n    lowerLegLength: 0.26,\n    upperArmLength: 0.205,\n    forearmLength: 0.188,\n    limbRadius: 0.047,\n    headRadius: 0.141,');

fs.writeFileSync(catalogPath, catalog);
