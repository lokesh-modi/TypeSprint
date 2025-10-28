import { Settings } from '../types';

const SETTINGS_KEY = 'typesprint_settings';
const BEST_WPM_KEY = 'typesprint_best_wpm';

export const defaultSettings: Settings = {
  theme: 'dark',
  fontStyle: 'mono',
  soundEnabled: false,
  showTimer: true,
  testDuration: 30,
  testMode: 'words'
};

export const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadBestWPM = (): number => {
  try {
    const stored = localStorage.getItem(BEST_WPM_KEY);
    return stored ? parseFloat(stored) : 0;
  } catch (error) {
    console.error('Failed to load best WPM:', error);
    return 0;
  }
};

export const saveBestWPM = (wpm: number): void => {
  try {
    const currentBest = loadBestWPM();
    if (wpm > currentBest) {
      localStorage.setItem(BEST_WPM_KEY, wpm.toString());
    }
  } catch (error) {
    console.error('Failed to save best WPM:', error);
  }
};
