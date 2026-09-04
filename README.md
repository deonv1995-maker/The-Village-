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

**Foundation 0.1 — browser runtime and project structure.**

The immediate target is a small playable test world with a settlement camera and multiple placeholder villagers. From there the project will add selection, commands, movement, shared jobs, resources, hauling, storage, and construction in that order.

## Project Documentation

- `Docs/PROJECT_VISION.md` — game identity, player fantasy, control model, and design pillars.
- `Docs/ARCHITECTURE.md` — authoritative technical boundaries and early system ownership.
- `Docs/ROADMAP.md` — staged development order toward the first playable vertical slice.

## Immediate Milestone

Establish the first stable gameplay loop:

**select villager → issue command → create/assign job → move → interact → complete job**
