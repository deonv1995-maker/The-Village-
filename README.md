# The Village

**The Village** is a mobile-first 3D settlement-management / RTS / colony-simulation game where the player directs multiple persistent villagers rather than controlling one main character.

This project is separate from **The Villager** and **Beyond 2000**. It has its own repository, architecture, gameplay rules, assets, and design history.

## Development model

The Village is built directly in this repository as a browser game. The user does not need to work in Unity or another editor for normal development.

The technical foundation mirrors the proven workflow used by The Villager Rebuild:

- Three.js as the 3D runtime
- Vite for development and production builds
- ES modules with clear system boundaries
- GitHub as the source of truth
- browser/mobile testing from generated builds
- automated build checks before stable changes are considered safe

## Core Development Principle

The game is built as a collection of reusable interacting systems. Villagers execute shared jobs and tasks rather than owning separate implementations of gathering, hauling, construction, farming, hunting, crafting, storage, or other world activities.

The architecture must scale from a small starting group into a substantial settlement without rewriting the core systems.

## Current Stage

**Foundation 0.3 — movement commands.**

The browser test world now has the settlement camera, six modular articulated villagers, authoritative selection state, touch/mouse selection, direct move commands, authoritative world bounds, and a separate navigation execution boundary.

Selected villagers can be ordered to valid ground. Multi-selected villagers preserve their current formation offsets rather than collapsing onto one point, and rendering follows authoritative villager position/state.

The next gameplay milestone is the reusable job/task foundation so direct commands and future autonomous work share one execution lifecycle.

## Project Documentation

- `Docs/PROJECT_VISION.md` — game identity, player fantasy, control model, and design pillars.
- `Docs/ARCHITECTURE.md` — authoritative technical boundaries and early system ownership.
- `Docs/ROADMAP.md` — staged development order toward the first playable vertical slice.
- `Docs/VILLAGER_CHARACTER_SYSTEM.md` — shared rig, modular appearance, animation, and villager asset ownership.
- `Docs/MOVEMENT_COMMAND_SYSTEM.md` — move-command ownership, input arbitration, navigation boundary, and Phase 5 upgrade path.

## Immediate Milestone

Establish the first stable gameplay loop:

**select villager → issue command → create/assign job → move → interact → complete job**
