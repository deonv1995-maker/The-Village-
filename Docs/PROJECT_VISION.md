# The Village — Project Vision

## Identity

The Village is a separate project from The Villager and Beyond 2000.

It is a settlement-management / RTS / colony-simulation game in which the player controls a community rather than a single main character.

## Player Fantasy

The player is responsible for building, directing, protecting, and growing a living settlement.

The settlement and its people are the persistent focus of the game. Individual villagers matter, but no single villager is the permanent player avatar.

## Core Control Model

The game should support two complementary control modes built on the same underlying systems.

### Direct Commands

The player selects one or more villagers and issues explicit orders such as:

- move here
- gather this resource
- build this structure
- haul this item
- attack this target
- interact with this object

### Autonomous Work

Villagers can also choose available work according to settlement priorities and their own eligibility, including:

- role
- skills
- permissions
- needs
- distance
- tool/equipment requirements
- job availability
- reservation state

Direct orders and autonomous work must not become separate gameplay implementations. Both should feed the same job/task execution pipeline.

## Core Gameplay Loop

The first stable loop is:

**player selects villager → issues command → job/task is created or assigned → villager navigates → villager interacts → task completes → world state updates**

This loop is the foundation for gathering, hauling, storage, construction, farming, crafting, hunting, combat, and future settlement systems.

## Design Pillars

### 1. The Settlement Is the Main Character

Progress is measured through the people, resources, infrastructure, safety, and capability of the settlement rather than one hero character.

### 2. Persistent Villagers

Villagers should be individual persistent entities rather than disposable RTS workers. Over time they may have identity, age, role, skills, traits, health, needs, inventory, equipment, relationships, and history.

Only the data needed by the current development stage should be implemented immediately.

### 3. Shared Work Systems

NPCs execute reusable jobs and tasks. Gathering, hauling, building, farming, hunting, crafting, storage, and similar activities belong to shared systems rather than being reimplemented inside each NPC.

### 4. Player Agency Without Constant Micromanagement

The player should be able to intervene directly when precision matters while allowing routine work to become increasingly autonomous as the settlement grows.

### 5. Meaningful Physical World

Resources, items, buildings, storage, workstations, and destinations should exist as authoritative world state that villagers interact with through clear rules and reservations.

### 6. Expandable Without Core Rewrites

The architecture must scale from a handful of villagers to a substantial settlement while preserving clear ownership of state and avoiding per-NPC duplication.

### 7. Mobile-First Clarity

Controls and UI should be readable and usable on mobile hardware, with simple selection, command, and management interactions. Performance decisions must account for many independently simulated villagers.

## Long-Term Possibilities

The architecture should leave clean extension points for systems such as:

- farming
- hunting
- crafting and production chains
- combat and settlement defense
- weather and seasons
- villager needs
- skills and occupations
- families and generations
- animals
- trade
- exploration
- progression

These are future possibilities, not requirements for the first playable build.

## Scope Rule

Do not build advanced simulation before the basic command-to-job loop is reliable.

The early game must first prove that the player can select villagers, issue work, watch them navigate and interact correctly, and trust the resulting world state.
