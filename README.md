# The Village

**The Village** is a settlement-management / RTS / colony-simulation game where the player directs multiple persistent villagers rather than controlling one main character.

The player will be able to issue direct commands to selected villagers while also allowing villagers to perform autonomous work through shared job and task systems.

## Core Development Principle

The game is built as a collection of reusable interacting systems. NPCs execute shared jobs and tasks rather than owning separate implementations of gathering, hauling, construction, farming, hunting, crafting, storage, or other world activities.

The architecture must be able to scale from a small starting group into a substantial settlement without rewriting the core systems.

## Current Stage

Repository foundation and project architecture definition.

No Unity project files have been committed yet.

## Project Documentation

- `Docs/PROJECT_VISION.md` — game identity, player fantasy, control model, and design pillars.
- `Docs/ARCHITECTURE.md` — authoritative technical boundaries and early system ownership.
- `Docs/ROADMAP.md` — staged development order toward the first playable vertical slice.

## Immediate Milestone

Establish the first stable gameplay loop:

**select villager → issue command → create/assign job → move → interact → complete job**
