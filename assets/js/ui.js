import { APP_CONFIG } from './config.js';

const getElement = (id) => document.getElementById(id);

export const elements = Object.freeze({
  input: getElement('ipInput'),
  searchForm: getElement('searchForm'),
  searchButton: getElement('searchButton'),
  myIpButton: getElement('myIpButton'),
  loading: getElement('loading'),
  radar: getElement('radar'),
  target: getElement('target'),
  stateLabel: getElement('stateLabel'),
  activeIp: getElement('activeIp'),
  copyButton: getElement('copyButton'),
  footerStatus: getElement('footerStatus'),
  timestamp: getElement('timestamp'),
  toast: getElement('toast'),
  toastIcon: getElement('toastIcon'),
  toastMessage: getElement('toastMessage'),
  toastClose: getElement('toastClose'),
  historyList: getElement('historyList'),
  emptyHistory: getElement('emptyHistory'),
  clearHistory: getElement('clearHistory'),
  themeButton: getElement('themeButton'),
});

const detailFields = [
  'ipVersion',
  'countryCode',
  'asn',
  'organization',
  'hostname',
  'country',
  'region',
  'city',
  'latitude',
  'longitude',
  'coordinates',
  'timezone',
  'postal',
];

let toastTimer = null;

export function setLoading(isLoading, hasResult) {
  elements.loading.classList.toggle('show', isLoading);

  elements.loading.setAttribute(
    'aria-hidden',
    String(!isLoading)
  );

  elements.radar.classList.toggle('scanning', isLoading);

  elements.searchButton.disabled = isLoading;
  elements.myIpButton.disabled = isLoading;
  elements.input.disabled = isLoading;

  if (isLoading) {
    elements.stateLabel.textContent = '◌ Scanning';
    elements.stateLabel.className = 'state scanning';
    return;
  }

  if (hasResult) {
    elements.stateLabel.textContent = '● Target found';
    elements.stateLabel.className = 'state found';
    return;
  }

  elements.stateLabel.textContent = '● Standby';
  elements.stateLabel.className = 'state';
}

export function showToast(message, type = 'success') {
  clearTimeout(toastTimer);

  elements.toast.className = `toast ${type} show`;

  elements.toastIcon.textContent =
    type === 'error' ? '✕' : '✓';

  elements.toastMessage.textContent = message;

  toastTimer = window.setTimeout(hideToast, 4600);
}

export function hideToast() {
  elements.toast.className = 'toast';
}

export function displayResult(data) {
  elements.activeIp.textContent = data.ip;

  detailFields.forEach((field) => {
    const fieldElement = getElement(field);

    if (!fieldElement) {
      return;
    }

    const dataField = field === 'ipVersion'
      ? 'version'
      : field;

    fieldElement.textContent =
      data[dataField] || 'Unavailable';
  });

  elements.target.classList.add('found');

  elements.copyButton.disabled = false;

  elements.footerStatus.textContent =
    `LAST RESULT: ${data.ip}`;

  elements.timestamp.textContent =
    new Intl.DateTimeFormat(APP_CONFIG.locale, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date(data.fetchedAt));
}

function escapeHtml(value) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  };

  return String(value).replace(
    /[&<>'"]/g,
    (character) => htmlEntities[character]
  );
}

export function renderHistory(items, onSelect) {
  elements.historyList.replaceChildren();

  elements.emptyHistory.hidden = items.length > 0;

  items.forEach((item) => {
    const location = [
      item.city,
      item.region,
      item.countryCode,
    ]
      .filter(
        (value) =>
          value &&
          value !== 'Unavailable'
      )
      .join(', ') || 'Location unavailable';

    const date = new Intl.DateTimeFormat(APP_CONFIG.locale, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(item.fetchedAt));

    const listItem = document.createElement('li');
    const button = document.createElement('button');

    button.type = 'button';

    button.innerHTML = `
      <span>
        <strong>${escapeHtml(item.ip)}</strong>
        <small>
          ${escapeHtml(location)} · ${escapeHtml(item.version)}
        </small>
      </span>
      <time>${escapeHtml(date)}</time>
    `;

    button.addEventListener('click', () => {
      onSelect(item.ip);
    });

    listItem.append(button);

    elements.historyList.append(listItem);
  });
}

export function setTheme(theme) {
  const isLightTheme = theme === 'light';

  document.documentElement.dataset.theme = theme;

  elements.themeButton.textContent = isLightTheme
    ? '◑ Dark theme'
    : '◐ Light theme';

  elements.themeButton.setAttribute(
    'aria-pressed',
    String(isLightTheme)
  );

  localStorage.setItem(
    'ip-intelligence-console-theme',
    theme
  );
}

export function restoreTheme() {
  const savedTheme = localStorage.getItem(
    'ip-intelligence-console-theme'
  );

  const prefersLightTheme =
    window.matchMedia &&
    window.matchMedia(
      '(prefers-color-scheme: light)'
    ).matches;

  const theme = savedTheme || (
    prefersLightTheme ? 'light' : 'dark'
  );

  setTheme(theme);
}