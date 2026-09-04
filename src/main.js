import './styles.css';
import { VillageGame } from './core/VillageGame.js';
import { PwaInstallController, registerVillageServiceWorker } from './core/PwaInstallController.js';

const root = document.querySelector('#app');

if (!root) {
  throw new Error('The Village requires a #app root element.');
}

registerVillageServiceWorker();

const shell = document.createElement('div');
shell.className = 'game-shell';
shell.innerHTML = `
  <div class="game-view" data-game-view></div>
  <div class="hud">
    <div class="hud__title">
      <strong>The Village</strong>
      <span>Foundation 0.3 — movement commands</span>
    </div>
    <button class="pwa-install" type="button" data-install-app hidden>Install app</button>
    <div class="hud__hint">Tap a villager to select · tap ground to move · long-press villager to multi-select · long-press ground or Esc to clear · drag to pan · pinch/wheel to zoom</div>
  </div>
`;
root.append(shell);

const installButton = shell.querySelector('[data-install-app]');
const pwaInstall = new PwaInstallController({ button: installButton });
const view = shell.querySelector('[data-game-view]');
const game = new VillageGame({ container: view });

window.addEventListener('pagehide', () => pwaInstall.dispose(), { once: true });

try {
  game.start();
} catch (error) {
  console.error(error);
  root.innerHTML = `<div class="boot-error"><div><h1>The Village</h1><p>The game could not start.</p></div></div>`;
}
