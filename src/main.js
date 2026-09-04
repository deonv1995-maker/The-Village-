import './styles.css';
import { VillageGame } from './core/VillageGame.js';

const root = document.querySelector('#app');

if (!root) {
  throw new Error('The Village requires a #app root element.');
}

const shell = document.createElement('div');
shell.className = 'game-shell';
shell.innerHTML = `
  <div class="game-view" data-game-view></div>
  <div class="hud">
    <div class="hud__title">
      <strong>The Village</strong>
      <span>Foundation 0.2 — villager selection</span>
    </div>
    <div class="hud__hint">Tap a villager to select · long-press or Ctrl/Shift-tap to add/remove · tap ground to clear · drag to pan · pinch/wheel to zoom</div>
  </div>
`;
root.append(shell);

const view = shell.querySelector('[data-game-view]');
const game = new VillageGame({ container: view });

try {
  game.start();
} catch (error) {
  console.error(error);
  root.innerHTML = `<div class="boot-error"><div><h1>The Village</h1><p>The game could not start.</p></div></div>`;
}
