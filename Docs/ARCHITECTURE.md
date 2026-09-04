# The Village — Initial Architecture

## Purpose

This document defines the early architectural boundaries for The Village. It should evolve with the project, but changes to these ownership rules should be deliberate and documented.

The immediate goal is not to build every future system. It is to establish a clean foundation for the first reliable gameplay loop:

**selection → command → job/task → movement → interaction → completion**

## Architectural Principles

1. One authoritative owner for each category of gameplay state.
2. Shared systems provide world behavior; NPCs execute through those systems.
3. Direct commands and autonomous work share the same execution path.
4. UI displays state and sends commands; it does not own gameplay state.
5. Content should be data-driven where that removes hard-coded duplication.
6. Persistent data must remain separable from Unity runtime object references.
7. Systems that scale with villager count must avoid unnecessary per-frame work.

## Initial Runtime Layers

### Presentation Layer

Responsible for:

- camera
- input
- selection visuals
- command UI
- villager panels
- world-space feedback

This layer may request gameplay actions but must not own authoritative job, inventory, resource, or construction state.

### Command Layer

Responsible for translating player intent into gameplay requests.

Examples:

- move selected villagers
- gather selected resource
- construct selected building
- attack selected target

Commands should produce or prioritize work through the same job/task infrastructure used by autonomous villagers.

### NPC Layer

Each villager owns only its individual runtime state and execution context.

Possible responsibilities:

- stable identity
- current state
- current job/task reference
- skills/role data
- needs data
- carried inventory/equipment
- movement agent reference

The NPC must not independently implement every activity in the game.

### Job System

Authoritative owner of available work and work assignment rules.

Responsibilities may include:

- creating jobs
- tracking job lifecycle
- priority
- eligibility
- assignment
- cancellation
- completion
- failure handling

A job describes the desired outcome. It should not need to know presentation details.

### Task Execution

Tasks represent executable steps needed to complete a job.

Example gather job:

1. reserve resource
2. move to resource
3. interact/gather
4. acquire item
5. determine delivery/storage destination
6. move to destination
7. deposit item
8. release reservations
9. complete

Jobs may initially use simple task sequences. Do not create a speculative general-purpose AI framework before real gameplay requires it.

### Reservation System

Provides exclusive or capacity-based claims on shared world state.

Initial reservation candidates:

- resource nodes
- loose items
- jobs
- storage destinations
- construction requirements
- interaction/work positions

Reservations must release on success, cancellation, invalidation, failure, or villager destruction where applicable.

### Navigation / Movement

Navigation owns path/destination solving. Villager movement executes the result.

Keep separate concepts for:

- destination requests
- pathfinding
- movement
- arrival detection
- local avoidance
- animation

Avoid repeated path requests when the destination has not meaningfully changed.

### Resource System

Resource content should use shared definitions rather than type-specific scripts wherever practical.

A resource definition may eventually include:

- stable ID
- display name
- category
- icon/visual references
- gather time
- required tool/skill
- produced item
- yield
- respawn/depletion rules

Runtime resource nodes own their world-specific state such as remaining quantity and reservation availability.

### Item / Inventory System

Item definitions describe item types. Runtime inventory state tracks quantities or item instances as appropriate.

NPC carrying, storage, crafting, and construction should use the same authoritative item definitions.

Do not introduce multiple incompatible inventory representations for different systems.

### Storage System

Storage accepts and exposes items according to capacity and allowed-item rules.

Storage destinations should be reservable so several villagers cannot incorrectly target the same capacity.

### Building / Construction

Keep these concerns separate:

- building definition
- placement/validation
- construction site state
- required materials
- worker interaction/progress
- completed building behavior
- visuals

The completed building should not need to retain construction responsibilities unless explicitly required.

### Persistence

Persistent systems should expose serializable state containing stable IDs and values rather than direct Unity object references.

Save-system implementation is not required at the first movement milestone, but stable IDs and ownership rules should not make persistence impossible later.

## Suggested Initial Code Organization

Once the Unity project exists, prefer feature/system folders over one large Scripts directory. A possible starting structure is:

```text
Assets/
  TheVillage/
    Runtime/
      Core/
      Input/
      Camera/
      Selection/
      Commands/
      NPC/
      Jobs/
      Navigation/
      Resources/
      Items/
      Inventory/
      Storage/
      Building/
      Persistence/
      UI/
    Data/
    Prefabs/
    Scenes/
    Art/
    Audio/
    Tests/
```

This is an initial organization target, not permission to create empty architecture for systems that are not yet needed.

## Dependency Direction

Prefer dependencies that point toward shared abstractions/data rather than sideways through unrelated concrete systems.

Example:

```text
UI/Input
   ↓
Command API
   ↓
Job System
   ↓
Task Execution
   ↓
Navigation / Resources / Inventory / Building
```

NPC execution coordinates the current task but should not become the authoritative owner of global resource, storage, or building state.

## Performance Rules

For villager-scaled systems:

- avoid one expensive Update loop per NPC where scheduled/ticked processing is sufficient
- cache required references
- avoid hierarchy searches during gameplay
- avoid repeated allocations in hot paths
- avoid unnecessary LINQ in simulation loops
- rate-limit autonomous job evaluation
- avoid recomputing paths without cause
- use pooling for high-churn objects when warranted
- prefer event-driven state changes where practical

Optimize measured bottlenecks, but preserve scalable ownership from the beginning.

## First Architectural Proof

Before expanding the simulation, the project should demonstrate:

1. multiple villagers exist in one scene
2. the player can select one or several
3. a command is issued through a command API
4. work is represented through the shared job/task path
5. villagers navigate to a valid target
6. interaction updates authoritative world state
7. jobs and reservations clean up correctly

If this loop is reliable, gathering, hauling, construction, and autonomous work can expand from the same foundation.
