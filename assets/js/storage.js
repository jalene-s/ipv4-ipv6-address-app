import { APP_CONFIG } from './config.js';

export function readHistory() {
  try {
    const storedHistory = localStorage.getItem(
      APP_CONFIG.historyKey
    );

    if (!storedHistory) {
      return [];
    }

    const history = JSON.parse(storedHistory);

    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

export function saveHistory(record) {
  const existingHistory = readHistory();

  const uniqueHistory = existingHistory.filter(
    (item) => item.ip !== record.ip
  );

  const updatedHistory = [record, ...uniqueHistory].slice(
    0,
    APP_CONFIG.historyLimit
  );

  localStorage.setItem(
    APP_CONFIG.historyKey,
    JSON.stringify(updatedHistory)
  );

  return updatedHistory;
}

export function clearHistory() {
  localStorage.removeItem(APP_CONFIG.historyKey);
}