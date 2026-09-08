import {
  fetchPublicIp,
  lookupIp,
} from './api.js';

import {
  clearHistory,
  readHistory,
  saveHistory,
} from './storage.js';

import { isValidIp } from './validation.js';

import {
  displayResult,
  elements,
  hideToast,
  renderHistory,
  restoreTheme,
  setLoading,
  setTheme,
  showToast,
} from './ui.js';

let currentResult = null;

function refreshHistory() {
  const history = readHistory();

  renderHistory(history, (ip) => {
    elements.input.value = ip;

    scanIp(ip, 'History scan');
  });
}

async function scanIp(ip, source) {
  setLoading(true, Boolean(currentResult));

  try {
    const result = await lookupIp(ip);

    currentResult = result;

    displayResult(result);

    elements.input.value = result.ip;

    saveHistory(result);

    refreshHistory();

    showToast(
      `${source} complete: ${result.ip} analyzed successfully.`
    );
  } catch (error) {
    const message =
      error.message || 'The IP lookup failed.';

    showToast(message, 'error');

    elements.footerStatus.textContent = 'SCAN FAILED';
  } finally {
    setLoading(false, Boolean(currentResult));
  }
}

async function scanMyIp() {
  setLoading(true, Boolean(currentResult));

  try {
    const publicIp = await fetchPublicIp();

    await scanIp(publicIp, 'My IP scan');
  } catch (error) {
    const message =
      error.message ||
      'Unable to retrieve your public IP address.';

    showToast(message, 'error');

    elements.footerStatus.textContent = 'SCAN FAILED';

    setLoading(false, Boolean(currentResult));
  }
}

async function copyCurrentIp() {
  if (!currentResult) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      currentResult.ip
    );

    elements.copyButton.textContent = '✓ Copied';

    showToast('IP address copied to the clipboard.');

    window.setTimeout(() => {
      elements.copyButton.textContent =
        '▣ Copy address';
    }, 1600);
  } catch {
    showToast(
      'Clipboard access was blocked by the browser.',
      'error'
    );
  }
}

function bindEvents() {
  elements.searchForm.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();

      const ip = elements.input.value.trim();

      if (!isValidIp(ip)) {
        showToast(
          'Enter a valid public IPv4 or IPv6 address before searching.',
          'error'
        );

        elements.input.focus();

        return;
      }

      scanIp(ip, 'Search IP');
    }
  );

  elements.myIpButton.addEventListener(
    'click',
    scanMyIp
  );

  elements.copyButton.addEventListener(
    'click',
    copyCurrentIp
  );

  elements.toastClose.addEventListener(
    'click',
    hideToast
  );

  elements.clearHistory.addEventListener(
    'click',
    () => {
      clearHistory();

      refreshHistory();

      showToast('Recent scan history cleared.');
    }
  );

  elements.themeButton.addEventListener(
    'click',
    () => {
      const currentTheme =
        document.documentElement.dataset.theme;

      const nextTheme =
        currentTheme === 'light'
          ? 'dark'
          : 'light';

      setTheme(nextTheme);
    }
  );
}

restoreTheme();
bindEvents();
refreshHistory();