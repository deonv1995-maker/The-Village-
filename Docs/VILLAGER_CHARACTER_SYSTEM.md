# The Village — Villager Character Asset System

## Purpose

Villagers use a reusable articulated 3D character asset system rather than one-off meshes per NPC.

The system is intentionally generated in Three.js code so normal development remains repository-first and does not require Unity, Blender, or another visual editor to keep the game playable. It can later ingest or replace individual visual modules with authored GLB assets without changing villager gameplay state.

## Current Character Set

The base catalog contains six body profiles:

- `adult_male_a`
- `adult_male_b`
- `adult_female_a`
- `adult_female_b`
- `child_boy`
- `child_girl`

These profiles vary proportions such as height, shoulder/hip width, limb dimensions, head size, and foot size while using the same rig contract.

## Shared Rig Contract

Every villager is built on the same named bone hierarchy:

```text
Root
└── Hips
    ├── Spine
    │   └── Chest
    │       ├── Neck
    │       │   └── Head
    │       ├── LeftUpperArm
    │       │   └── LeftLowerArm
    │       │       └── LeftHand
    │       └── RightUpperArm
    │           └── RightLowerArm
    │               └── RightHand
    ├── LeftUpperLeg
    │   └── LeftLowerLeg
    │       └── LeftFoot
    └── RightUpperLeg
        └── RightLowerLeg
            └── RightFoot
```

Bone names are a stable rendering contract. Future authored animation clips should target these names unless the rig contract is deliberately versioned.

## Animation

The first reusable clips are:

- `idle`
- `walk`

`VillagerAssetFactory` exposes an animation handle per villager while sharing the clip definitions. `VillagerViewSystem` currently chooses `idle` or `walk` from authoritative villager state.

Future work/task animations should be added to the shared animation library rather than embedded in individual NPCs.

## Modular Appearance

Appearance is authoritative villager data, while meshes/materials remain rendering presentation.

Current swappable appearance fields are:

- `bodyProfileId`
- `skinTone`
- `hairStyle`
- `hairColor`
- `outfitStyle`
- `primaryColor`
- `secondaryColor`

Hair styles:

- cropped
- side part
- messy
- bun
- braid
- shoulder length

Outfit styles:

- work tunic
- field vest
- long dress
- apron dress
- child tunic
- child dress

Adult and child silhouettes use the same rig contract but may use different proportional profiles and clothing modules. Starter presets are examples only; hair, clothing, and palette choices remain independently swappable.

The combination of body, hair, colors, and outfit is intended to create many visually distinct villagers without duplicating NPC logic.

## Ownership Boundary

`src/data/villagerAppearanceCatalog.js`
: Stable body profiles, palette values, modular option IDs, and starter appearance presets.

`src/rendering/villagers/VillagerAssetFactory.js`
: Builds the articulated Three.js character, skeleton, modular mesh pieces, face details, and cached rendering resources.

`src/rendering/villagers/VillagerAnimationLibrary.js`
: Owns reusable animation clips targeting the shared bone contract.

`src/rendering/VillagerViewSystem.js`
: Creates/removes villager presentation and updates animation from villager state. It must not become the owner of villager identity or gameplay state.

## Performance

Primitive geometries and materials are cached and reused across villagers. Each villager has its own lightweight bone hierarchy and animation mixer because nearby villagers need independent pose state.

When population scale requires it, optimize presentation with distance-based LOD, reduced animation updates, or impostors for distant villagers. Do not move simulation ownership into the rendering layer to gain performance.

## Future Asset Upgrade Path

This procedural character set is the baseline playable asset system, not a dead-end prototype.

A later authored art pass may replace body, hair, or clothing modules with GLB meshes provided that:

1. gameplay still stores only stable appearance/state data;
2. the shared bone naming/animation contract is preserved or explicitly versioned;
3. hair and clothing remain modular rather than creating a separate full character file for every combination;
4. mobile polygon/material budgets are measured;
5. distant-villager LOD remains possible.
