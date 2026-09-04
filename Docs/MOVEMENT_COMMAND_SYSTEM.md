# The Village — Movement Command System

## Purpose

Movement commands are the first direct-control gameplay path after villager selection.

The implementation keeps player input, command intent, navigation execution, authoritative simulation state, and rendering separate so later jobs/tasks can reuse the same movement boundary instead of introducing a second movement implementation.

## Ownership

`src/input/WorldInteractionController.js`
: Interprets pointer/touch gestures. It decides whether a tap targets a villager or valid ground, then sends selection or move requests. It does not move villagers directly.

`src/commands/CommandSystem.js`
: Owns the direct move-command API. It validates requested villager IDs and the requested destination, preserves the selected group’s current formation around the destination, and submits per-villager movement requests.

`src/navigation/NavigationSystem.js`
: Owns active movement destinations and movement execution. It updates authoritative villager position, heading, and moving/idle state, detects arrival, supports replacement requests, and cancels safely.

`src/world/WorldState.js`
: Owns the authoritative playable ground bounds and ground height used to validate movement destinations.

`src/rendering/VillagerViewSystem.js`
: Observes villager position, heading, and state and presents them. It does not own movement state or destinations.

`src/data/gameplayConfig.js`
: Single source of truth for shared world size, ground height, villager movement speed, and arrival threshold.

## Current Direct Move Flow

```text
pointer/touch gesture
      ↓
WorldInteractionController
      ↓
SelectionSystem selected villager IDs
      ↓
CommandSystem.issueMove(...)
      ↓
NavigationSystem.requestMove(...)
      ↓
authoritative villager position/state
      ↓
VillagerViewSystem presentation
```

## Group Movement

When more than one villager is ordered to move, `CommandSystem` calculates the group’s current centroid and preserves each villager’s relative offset around the requested destination.

This prevents the first implementation from sending every villager to exactly the same point while avoiding a premature formation framework. Individual derived destinations are clamped to valid world bounds.

## Input Contract

Current controls are intentionally mobile-first:

- tap/click a villager: select only that villager;
- long-press a villager, or Ctrl/Shift-click on desktop: add/remove that villager from the selection;
- tap/click valid ground with a non-empty selection: issue a move command;
- long-press empty ground or press Escape: clear selection;
- drag: camera pan;
- pinch or mouse wheel: zoom.

The world interaction controller owns tap-vs-drag arbitration so selection and movement do not compete through separate pointer handlers.

## Navigation Scope

The current navigation implementation intentionally performs direct ground-plane movement. It is a navigation boundary, not the final pathfinding solution.

Future obstacle-aware pathfinding may replace the path-solving internals provided that callers continue to request movement through the same navigation boundary. Path requests, path solving, movement execution, local avoidance, and animation should remain separable as settlement scale grows.

## Phase 5 Upgrade Path

Phase 5 will introduce the reusable job/task lifecycle. At that point direct movement commands should create/assign a move job/task rather than bypassing the shared execution lifecycle.

That change should preserve:

1. `WorldInteractionController` as player-intent input;
2. `CommandSystem` as the direct-command API;
3. `NavigationSystem` as movement execution;
4. authoritative villager/world state as the source of truth;
5. rendering as presentation only.

The job/task layer will be inserted between command intent and navigation execution rather than creating another movement system.
