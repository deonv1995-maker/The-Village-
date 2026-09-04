export class PwaInstallController {
  constructor({ button }) {
    if (!button) throw new Error('PwaInstallController requires an install button.');

    this.button = button;
    this.deferredPrompt = null;

    this.button.hidden = true;
    window.addEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
    window.addEventListener('appinstalled', this.onAppInstalled);
    this.button.addEventListener('click', this.onInstallClick);
  }

  onBeforeInstallPrompt = (event) => {
    event.preventDefault();
    this.deferredPrompt = event;
    this.button.hidden = false;
  };

  onInstallClick = async () => {
    if (!this.deferredPrompt) return;

    const prompt = this.deferredPrompt;
    this.deferredPrompt = null;
    this.button.hidden = true;

    await prompt.prompt();
    await prompt.userChoice;
  };

  onAppInstalled = () => {
    this.deferredPrompt = null;
    this.button.hidden = true;
  };

  dispose() {
    window.removeEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.onAppInstalled);
    this.button.removeEventListener('click', this.onInstallClick);
    this.deferredPrompt = null;
  }
}

export function registerVillageServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const baseUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    const workerUrl = new URL('sw.js', baseUrl);

    navigator.serviceWorker.register(workerUrl, { scope: baseUrl.pathname })
      .catch((error) => console.warn('The Village service worker could not register.', error));
  }, { once: true });
}
