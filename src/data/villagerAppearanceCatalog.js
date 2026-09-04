export const VILLAGER_BODY_PROFILES = Object.freeze({
  adult_male_a: Object.freeze({
    id: 'adult_male_a',
    label: 'Adult Male A',
    ageGroup: 'adult',
    bodyFamily: 'male',
    shoulderWidth: 0.58,
    hipWidth: 0.39,
    torsoDepth: 0.27,
    torsoLength: 0.57,
    upperLegLength: 0.40,
    lowerLegLength: 0.40,
    upperArmLength: 0.34,
    forearmLength: 0.30,
    limbRadius: 0.090,
    headRadius: 0.165,
    headWidthScale: 1.05,
    neckLength: 0.075,
    footHeight: 0.075,
    footLength: 0.27,
    footWidth: 0.14
  }),
  adult_male_b: Object.freeze({
    id: 'adult_male_b',
    label: 'Adult Male B',
    ageGroup: 'adult',
    bodyFamily: 'male',
    shoulderWidth: 0.51,
    hipWidth: 0.36,
    torsoDepth: 0.24,
    torsoLength: 0.55,
    upperLegLength: 0.39,
    lowerLegLength: 0.39,
    upperArmLength: 0.33,
    forearmLength: 0.29,
    limbRadius: 0.075,
    headRadius: 0.160,
    headWidthScale: 0.98,
    neckLength: 0.070,
    footHeight: 0.070,
    footLength: 0.26,
    footWidth: 0.13
  }),
  adult_female_a: Object.freeze({
    id: 'adult_female_a',
    label: 'Adult Female A',
    ageGroup: 'adult',
    bodyFamily: 'female',
    shoulderWidth: 0.48,
    hipWidth: 0.44,
    torsoDepth: 0.24,
    torsoLength: 0.54,
    upperLegLength: 0.38,
    lowerLegLength: 0.38,
    upperArmLength: 0.31,
    forearmLength: 0.28,
    limbRadius: 0.074,
    headRadius: 0.158,
    headWidthScale: 0.97,
    neckLength: 0.068,
    footHeight: 0.068,
    footLength: 0.245,
    footWidth: 0.125
  }),
  adult_female_b: Object.freeze({
    id: 'adult_female_b',
    label: 'Adult Female B',
    ageGroup: 'adult',
    bodyFamily: 'female',
    shoulderWidth: 0.44,
    hipWidth: 0.41,
    torsoDepth: 0.22,
    torsoLength: 0.53,
    upperLegLength: 0.39,
    lowerLegLength: 0.39,
    upperArmLength: 0.30,
    forearmLength: 0.275,
    limbRadius: 0.066,
    headRadius: 0.155,
    headWidthScale: 0.94,
    neckLength: 0.066,
    footHeight: 0.066,
    footLength: 0.24,
    footWidth: 0.12
  }),
  child_boy: Object.freeze({
    id: 'child_boy',
    label: 'Boy',
    ageGroup: 'child',
    bodyFamily: 'male',
    shoulderWidth: 0.35,
    hipWidth: 0.29,
    torsoDepth: 0.19,
    torsoLength: 0.39,
    upperLegLength: 0.275,
    lowerLegLength: 0.275,
    upperArmLength: 0.225,
    forearmLength: 0.205,
    limbRadius: 0.052,
    headRadius: 0.137,
    headWidthScale: 1.02,
    neckLength: 0.045,
    footHeight: 0.055,
    footLength: 0.19,
    footWidth: 0.095
  }),
  child_girl: Object.freeze({
    id: 'child_girl',
    label: 'Girl',
    ageGroup: 'child',
    bodyFamily: 'female',
    shoulderWidth: 0.33,
    hipWidth: 0.30,
    torsoDepth: 0.18,
    torsoLength: 0.38,
    upperLegLength: 0.265,
    lowerLegLength: 0.265,
    upperArmLength: 0.215,
    forearmLength: 0.195,
    limbRadius: 0.049,
    headRadius: 0.135,
    headWidthScale: 1.00,
    neckLength: 0.044,
    footHeight: 0.052,
    footLength: 0.185,
    footWidth: 0.092
  })
});

export const VILLAGER_SKIN_TONES = Object.freeze({
  fair: '#e8bd98',
  warm: '#c98b63',
  tan: '#ad6f49',
  deep: '#75452f'
});

export const VILLAGER_HAIR_COLORS = Object.freeze({
  flax: '#b89a5b',
  auburn: '#7b3f24',
  brown: '#4c3023',
  dark: '#211b18',
  grey: '#756f67'
});

export const VILLAGER_CLOTH_COLORS = Object.freeze({
  oat: '#cbbf9b',
  cream: '#d8cfb5',
  moss: '#66714a',
  forest: '#3f5b46',
  clay: '#9b5b3f',
  rust: '#8d4d32',
  ochre: '#b1843f',
  river: '#4d6f7d',
  burgundy: '#6c3c42',
  charcoal: '#3f4140'
});

export const VILLAGER_HAIR_STYLES = Object.freeze([
  'cropped',
  'side_part',
  'messy',
  'bun',
  'braid',
  'shoulder'
]);

export const VILLAGER_OUTFIT_STYLES = Object.freeze([
  'work_tunic',
  'field_vest',
  'long_dress',
  'apron_dress',
  'child_tunic'
]);

export const VILLAGER_APPEARANCE_PRESETS = Object.freeze({
  male_a: Object.freeze({
    bodyProfileId: 'adult_male_a',
    skinTone: 'warm',
    hairStyle: 'cropped',
    hairColor: 'dark',
    outfitStyle: 'work_tunic',
    primaryColor: 'moss',
    secondaryColor: 'charcoal'
  }),
  male_b: Object.freeze({
    bodyProfileId: 'adult_male_b',
    skinTone: 'fair',
    hairStyle: 'side_part',
    hairColor: 'auburn',
    outfitStyle: 'field_vest',
    primaryColor: 'rust',
    secondaryColor: 'oat'
  }),
  female_a: Object.freeze({
    bodyProfileId: 'adult_female_a',
    skinTone: 'tan',
    hairStyle: 'bun',
    hairColor: 'brown',
    outfitStyle: 'apron_dress',
    primaryColor: 'cream',
    secondaryColor: 'river'
  }),
  female_b: Object.freeze({
    bodyProfileId: 'adult_female_b',
    skinTone: 'fair',
    hairStyle: 'braid',
    hairColor: 'flax',
    outfitStyle: 'long_dress',
    primaryColor: 'burgundy',
    secondaryColor: 'oat'
  }),
  boy: Object.freeze({
    bodyProfileId: 'child_boy',
    skinTone: 'warm',
    hairStyle: 'messy',
    hairColor: 'brown',
    outfitStyle: 'child_tunic',
    primaryColor: 'ochre',
    secondaryColor: 'charcoal'
  }),
  girl: Object.freeze({
    bodyProfileId: 'child_girl',
    skinTone: 'tan',
    hairStyle: 'shoulder',
    hairColor: 'dark',
    outfitStyle: 'child_tunic',
    primaryColor: 'river',
    secondaryColor: 'cream'
  })
});

export function getVillagerBodyProfile(profileId) {
  const profile = VILLAGER_BODY_PROFILES[profileId];
  if (!profile) throw new Error(`Unknown villager body profile: ${profileId}`);
  return profile;
}

export function createVillagerAppearance(presetId) {
  const preset = VILLAGER_APPEARANCE_PRESETS[presetId];
  if (!preset) throw new Error(`Unknown villager appearance preset: ${presetId}`);
  return { ...preset };
}

export function resolveVillagerAppearanceColors(appearance) {
  return {
    skin: VILLAGER_SKIN_TONES[appearance.skinTone] ?? VILLAGER_SKIN_TONES.warm,
    hair: VILLAGER_HAIR_COLORS[appearance.hairColor] ?? VILLAGER_HAIR_COLORS.brown,
    primary: VILLAGER_CLOTH_COLORS[appearance.primaryColor] ?? VILLAGER_CLOTH_COLORS.moss,
    secondary: VILLAGER_CLOTH_COLORS[appearance.secondaryColor] ?? VILLAGER_CLOTH_COLORS.oat
  };
}
