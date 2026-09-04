# The Village — Early Development Roadmap

## Goal

Reach a small but reliable playable vertical slice before expanding into deeper settlement simulation.

The first proof is a trustworthy loop where the player can direct multiple villagers and shared systems execute that work correctly.

## Phase 0 — Repository and Browser Foundation

Status: **In progress**

- [x] Create repository
- [x] Define project identity and development rules
- [x] Add project vision
- [x] Add architecture document
- [x] Add early roadmap
- [x] Choose browser-first Three.js + Vite stack
- [x] Replace Unity-specific repository rules
- [x] Create minimal browser runtime
- [x] Add automated build verification
- [ ] Confirm mobile/desktop production build

Exit condition: the repository builds into a small browser game that starts reliably without Unity or another editor.

## Phase 1 — Playable Test World

- [ ] Create a simple 3D test world
- [ ] Establish authoritative ground/world representation
- [ ] Add settlement camera pan
- [ ] Add zoom
- [ ] Validate touch and mouse input
- [ ] Keep rendering separate from world state

Exit condition: the player can reliably inspect the playable test area on desktop and mobile.

## Phase 2 — Villager Representation

- [ ] Create minimal villager state model
- [ ] Give villagers stable IDs
- [ ] Create separate villager rendering representation
- [ ] Place multiple villagers in the test world
- [ ] Keep gameplay state independent of Three.js meshes

Do not add full needs, relationships, aging, combat, or occupations yet.

Exit condition: multiple independent villagers exist with clean state ownership and separate presentation.

## Phase 3 — Selection

- [ ] Single villager selection
- [ ] Deselection
- [ ] Multi-selection
- [ ] Clear visual selection feedback
- [ ] Selection state owned outside UI/rendering presentation
- [ ] Mobile-friendly touch behavior

Exit condition: the player can reliably select the intended villager or group.

## Phase 4 — Movement Commands

- [ ] Define command API
- [ ] Issue move order to selected villager(s)
- [ ] Add navigation/destination request boundary
- [ ] Execute movement
- [ ] Detect arrival/completion
- [ ] Handle invalid destinations safely
- [ ] Avoid unnecessary path recomputation

Exit condition: selected villagers can be ordered to a destination and reliably complete the move command.

## Phase 5 — Job / Task Foundation

- [ ] Define minimal job lifecycle
- [ ] Define task execution contract/state
- [ ] Route direct commands through shared execution
- [ ] Add cancellation/failure handling
- [ ] Add minimal reservation service
- [ ] Verify cleanup on interruption

Exit condition: villager work flows through reusable jobs/tasks rather than ad-hoc command logic.

## Phase 6 — Resources and Gathering

- [ ] Create resource definition data
- [ ] Create runtime resource nodes
- [ ] Add quantity/depletion state
- [ ] Add gather job
- [ ] Reserve gather target
- [ ] Navigate to target
- [ ] Perform gather interaction
- [ ] Produce authoritative item/inventory state
- [ ] Release reservation correctly

Exit condition: the player can order a villager to gather a resource and the state updates correctly.

## Phase 7 — Carrying and Inventory

- [ ] Define item data
- [ ] Implement one authoritative inventory representation
- [ ] Add villager carrying capacity/state
- [ ] Connect gathering output to inventory
- [ ] Add presentation feedback where useful

Exit condition: gathered resources are represented consistently as items carried by villagers.

## Phase 8 — Storage and Hauling

- [ ] Create storage state/component
- [ ] Define capacity and acceptance rules
- [ ] Add reservable storage destination/capacity
- [ ] Add haul/deliver job
- [ ] Deposit items into storage
- [ ] Handle full/invalid storage safely

Exit condition: villagers can carry and deliver resources to shared storage without conflicting claims.

## Phase 9 — Basic Building Placement

- [ ] Create building definition data
- [ ] Add placement preview
- [ ] Add placement validation
- [ ] Create construction-site state
- [ ] Define resource requirements

Exit condition: the player can place a valid construction site with authoritative requirements.

## Phase 10 — Villager Construction

- [ ] Create material delivery tasks
- [ ] Reserve required construction resources
- [ ] Deliver resources
- [ ] Perform construction work
- [ ] Track construction progress
- [ ] Transition site to completed building
- [ ] Release reservations safely

Exit condition: villagers can build a placed structure through the shared job system.

## Phase 11 — Autonomous Work

Only begin once direct commands and jobs are reliable.

- [ ] Create periodic job evaluation
- [ ] Add priority and eligibility rules
- [ ] Respect reservations
- [ ] Respect direct-command overrides
- [ ] Avoid per-frame AI decision polling

Exit condition: villagers can perform routine work without constant player orders while remaining predictable under direct commands.

## Phase 12 — Save / Load Foundation

- [ ] Define stable persistent IDs
- [ ] Define serializable villager state
- [ ] Define serializable world/resource state
- [ ] Define storage/inventory persistence
- [ ] Define construction/building persistence
- [ ] Save minimal test settlement
- [ ] Reload it without Three.js/DOM reference coupling

Exit condition: the vertical slice can persist and restore correctly.

## First Vertical Slice

The first meaningful playable slice is complete when the player can:

1. move the camera around a test world
2. select one or more villagers
3. order villagers to move
4. order a villager to gather a resource
5. have the villager navigate, reserve, gather, and carry it
6. haul the resource to storage
7. place a basic building
8. have villagers deliver materials and construct it
9. save and reload the resulting state

## Explicitly Deferred

Until that loop is stable, defer complex combat, diplomacy, large technology trees, generations/families, advanced needs, complex trade/economy, weather/seasons, large production chains, advanced farming, large animal ecosystems, and multiplayer.

These systems may become important later, but none should force a rewrite of the core command/job/movement/interaction architecture.
