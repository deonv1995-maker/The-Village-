# The Village — Early Development Roadmap

## Goal

Reach a small but reliable playable vertical slice before expanding into deeper settlement simulation.

The first proof of the game is not a large content set. It is a trustworthy loop where the player can direct multiple villagers and the shared systems execute that work correctly.

## Phase 0 — Repository and Project Foundation

Status: **In progress**

- [x] Create repository
- [x] Define project identity and development rules
- [x] Add project vision
- [x] Add initial architecture document
- [x] Add early roadmap
- [ ] Create Unity project and commit project files
- [ ] Add Unity-appropriate `.gitignore`
- [ ] Confirm target Unity version and platform settings
- [ ] Establish initial scene and folder structure

Exit condition: the repository contains a clean Unity project that opens successfully and can be built/run as a minimal empty test application.

## Phase 1 — Playable Test World

- [ ] Create a simple test scene
- [ ] Establish ground/world representation
- [ ] Add camera movement
- [ ] Add zoom
- [ ] Validate mobile-friendly camera input approach

Exit condition: the player can reliably inspect the playable test area.

## Phase 2 — Villager Representation

- [ ] Create minimal villager runtime component
- [ ] Give villagers stable runtime identity
- [ ] Create one villager prefab
- [ ] Spawn/place multiple villagers in the test scene
- [ ] Keep presentation separate from villager state

Do not add full needs, relationships, aging, combat, or occupations yet.

Exit condition: multiple independent villagers exist with clean identity/state ownership.

## Phase 3 — Selection

- [ ] Single villager selection
- [ ] Deselection
- [ ] Multi-selection
- [ ] Clear selection feedback
- [ ] Selection state owned outside UI presentation
- [ ] Mobile-friendly touch selection behavior

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
- [ ] Route direct commands through the shared execution path where appropriate
- [ ] Add cancellation/failure handling
- [ ] Add minimal reservation service
- [ ] Verify cleanup on interruption

Exit condition: villager work is no longer ad-hoc command logic; it flows through a reusable job/task foundation.

## Phase 6 — Resources and Gathering

- [ ] Create resource definition data
- [ ] Create runtime resource node
- [ ] Add resource quantity/depletion state
- [ ] Add gather job
- [ ] Reserve gather target
- [ ] Navigate to target
- [ ] Perform gather interaction
- [ ] Produce authoritative item/inventory state
- [ ] Release reservation correctly

Exit condition: the player can order a villager to gather a resource and the resource/item state updates correctly.

## Phase 7 — Carrying and Inventory

- [ ] Define item data
- [ ] Implement one authoritative inventory representation
- [ ] Add villager carrying capacity/state
- [ ] Connect gathering output to inventory
- [ ] Add simple visual feedback if useful

Exit condition: gathered resources are represented consistently as items carried by villagers.

## Phase 8 — Storage and Hauling

- [ ] Create storage component
- [ ] Define capacity and acceptance rules
- [ ] Add reservable storage capacity/destination
- [ ] Add haul/deliver job
- [ ] Deposit items into storage
- [ ] Handle full/invalid storage safely

Exit condition: villagers can gather/carry resources and deliver them to shared storage without conflicting claims.

## Phase 9 — Basic Building Placement

- [ ] Create building definition data
- [ ] Add placement preview
- [ ] Add placement validation
- [ ] Create construction-site runtime state
- [ ] Define resource requirements

Exit condition: the player can place a valid construction site with authoritative requirements.

## Phase 10 — NPC Construction

- [ ] Create material delivery tasks
- [ ] Reserve required construction resources
- [ ] Deliver resources
- [ ] Perform construction work
- [ ] Track construction progress
- [ ] Transition construction site to completed building
- [ ] Release all reservations safely

Exit condition: villagers can build a placed structure using gathered/stored resources through the shared job system.

## Phase 11 — Autonomous Work

Only begin once direct commands and jobs are reliable.

- [ ] Create periodic job evaluation
- [ ] Add priority and eligibility rules
- [ ] Respect reservations
- [ ] Respect direct-command overrides
- [ ] Avoid per-frame decision polling

Exit condition: villagers can perform routine available work without constant player orders while still responding predictably to direct commands.

## Phase 12 — Save / Load Foundation

- [ ] Define stable persistent IDs
- [ ] Define serializable villager state
- [ ] Define serializable world/resource state
- [ ] Define storage/inventory persistence
- [ ] Define construction/building persistence
- [ ] Save minimal test settlement
- [ ] Load it back without runtime-reference coupling

Exit condition: the current vertical slice can persist and restore correctly.

## First Vertical Slice Definition

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

Until the core loop above is stable, defer:

- complex combat
- diplomacy
- large technology trees
- generations/families
- advanced villager needs
- complex economy/trade
- weather/seasons
- large production chains
- advanced farming
- large animal ecosystems
- multiplayer

These systems may become important later, but none should force a rewrite of the core command/job/movement/interaction architecture.
