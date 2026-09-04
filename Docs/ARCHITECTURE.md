# The Village — Technical Architecture

## Purpose

The Village is a mobile-first browser game built directly in this repository. Normal development does not depend on Unity or another visual editor.

The initial stack is intentionally close to The Villager Rebuild where that workflow is already proven:

- Three.js for 3D rendering
- Vite for development and production builds
- ES modules
- GitHub as source of truth
- generated browser builds for mobile/desktop testing
- automated build verification

The first architectural proof is:

**selection → command → job/task → movement → interaction → completion**

## Core Rules

1. One authoritative owner for each category of gameplay state.
2. Shared systems provide world behavior; villagers execute through those systems.
3. Direct commands and autonomous work share the same job/task execution path.
4. UI displays state and sends commands; it does not own gameplay state.
5. Content definitions stay data-driven where practical.
6. Persistent data uses stable IDs and serializable values, not live Three.js objects.
7. Villager-scaled systems avoid unnecessary per-frame work.
8. Rendering objects are presentation, never the source of truth for simulation state.

## Runtime Layers

### Core
Owns application lifecycle, game loop/timing, events, system startup/shutdown, and shared runtime coordination.

### Rendering
Owns the Three.js scene, renderer, cameras, lighting, visual instances, effects, LOD/culling, and world presentation. Rendering consumes authoritative state but does not define gameplay rules.

### Input / Camera
Owns pointer/touch interpretation and camera controls. Input converts player gestures into selection or command requests; it should not mutate gameplay state directly.

### Selection / Command
Selection tracks which villagers or valid targets are selected. Commands translate player intent into gameplay requests such as move, gather, build, haul, or attack.

Direct orders should use the same underlying execution systems later used by autonomous work.

### Villagers
Each villager owns its individual data and current execution context, for example:

- stable ID
- identity/display data
- world position/heading
- role/skills/traits
- needs/health when introduced
- carried inventory/equipment
- current job/task reference

A villager must not contain separate implementations of gathering, construction, hauling, farming, hunting, crafting, and storage.

### Jobs / Tasks
The job system owns available work, assignment, priority, lifecycle, cancellation, completion, and failure.

Tasks are executable steps within a job. Example gather flow:

1. reserve target
2. move to target
3. gather
4. receive item
5. find delivery destination
6. move to destination
7. deposit
8. release reservations
9. complete

Do not build a speculative general AI framework before real gameplay requires it.

### Reservations
Reservations prevent conflicting claims on resources, jobs, loose items, storage capacity, work positions, and construction requirements. Claims must release on completion, cancellation, failure, invalidation, or villager removal.

### Navigation / Movement
Keep path requests, path solving, movement execution, arrival detection, local avoidance, and animation separate. Avoid recalculating unchanged paths every frame.

The first movement implementation may be intentionally simple, but the API boundary must permit later scalable navigation without rewriting commands/jobs.

### World / Resources
The world owns terrain/traversability and resource-node runtime state. Resource definitions are shared data containing IDs, yield, gather requirements, visuals, depletion/renewal rules, and produced items where relevant.

### Items / Inventory / Storage
Use one authoritative item definition layer and one compatible inventory model across villagers, storage, crafting, construction, and hauling.

Storage exposes capacity/acceptance rules and reservable destinations.

### Buildings / Construction
Keep building definition, placement/validation, construction-site state, resource requirements, worker progress, completed-building behavior, and visuals separate.

### Persistence
Save data stores stable IDs and serializable gameplay state. It must not depend on Three.js meshes, scene graph references, DOM nodes, or transient runtime objects.

## Source Organization

Initial source boundaries:

```text
src/
  core/
  input/
  rendering/
  world/
  villagers/
  selection/
  commands/
  jobs/
  navigation/
  resources/
  items/
  inventory/
  storage/
  building/
  persistence/
  ui/
  data/
```

Only create folders/systems when the current milestone needs them; do not fill the repository with empty speculative architecture.

## Dependency Direction

Prefer:

```text
UI / Input
    ↓
Selection / Command API
    ↓
Job System
    ↓
Task Execution
    ↓
Navigation / World / Resources / Inventory / Building
```

Rendering observes state and presents it. It should not become an alternate simulation layer.

## Performance Rules

For mobile and larger settlements:

- centralize or schedule simulation work where appropriate
- avoid expensive logic on every villager every animation frame
- rate-limit autonomous job evaluation
- avoid repeated allocations in hot paths
- spatially partition world queries when scale requires it
- use instancing for repeated visual assets where practical
- pool high-churn effects/objects when warranted
- cap device pixel ratio/render cost where useful
- avoid repeated pathfinding without cause
- keep UI DOM updates event-driven
- profile before complex optimization, while preserving scalable ownership from day one

## Build / Deployment Boundary

Source code lives in the repository. Vite produces the deployable `dist/` build. Production should not rely on CDN import maps or editor-specific runtime files.

`main` should remain buildable/playable once gameplay development begins. Build checks should run before changes are treated as stable.

## First Architectural Proof

Before expanding the simulation, verify:

1. browser build starts reliably
2. test world renders on desktop/mobile browsers
3. multiple villagers exist as persistent state plus separate visuals
4. player can select one or more villagers
5. command API issues a move order
6. shared job/task path executes the order
7. navigation/movement completes it
8. interaction can change authoritative world state
9. cancellation/failure releases reservations correctly

Once this loop is trustworthy, gathering, hauling, storage, construction, and autonomous work can expand from the same foundation.
