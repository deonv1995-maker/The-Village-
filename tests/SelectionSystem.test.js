import test from 'node:test';
import assert from 'node:assert/strict';
import { SelectionSystem } from '../src/selection/SelectionSystem.js';

test('single selection replaces the current selection and clear removes it', () => {
  const selection = new SelectionSystem({ validIds: ['villager-001', 'villager-002'] });

  assert.equal(selection.selectOnly('villager-001'), true);
  assert.deepEqual(selection.getSelectedIds(), ['villager-001']);

  assert.equal(selection.selectOnly('villager-002'), true);
  assert.deepEqual(selection.getSelectedIds(), ['villager-002']);

  assert.equal(selection.clear(), true);
  assert.deepEqual(selection.getSelectedIds(), []);
});

test('toggle supports multi-selection and ignores invalid ids', () => {
  const selection = new SelectionSystem({ validIds: ['villager-001', 'villager-002'] });

  assert.equal(selection.toggle('villager-001'), true);
  assert.equal(selection.toggle('villager-002'), true);
  assert.deepEqual(selection.getSelectedIds(), ['villager-001', 'villager-002']);

  assert.equal(selection.toggle('villager-001'), true);
  assert.deepEqual(selection.getSelectedIds(), ['villager-002']);

  assert.equal(selection.toggle('missing-villager'), false);
  assert.deepEqual(selection.getSelectedIds(), ['villager-002']);
});

test('subscribers receive authoritative selection changes only when state changes', () => {
  const selection = new SelectionSystem({ validIds: ['villager-001'] });
  const snapshots = [];
  const unsubscribe = selection.subscribe((selectedIds) => snapshots.push(selectedIds));

  selection.selectOnly('villager-001');
  selection.selectOnly('villager-001');
  selection.clear();
  selection.clear();
  unsubscribe();
  selection.selectOnly('villager-001');

  assert.deepEqual(snapshots, [[], ['villager-001'], []]);
});

test('changing valid ids safely removes selections for villagers that no longer exist', () => {
  const selection = new SelectionSystem({ validIds: ['villager-001', 'villager-002'] });
  selection.toggle('villager-001');
  selection.toggle('villager-002');

  selection.setValidIds(['villager-002']);

  assert.deepEqual(selection.getSelectedIds(), ['villager-002']);
});
