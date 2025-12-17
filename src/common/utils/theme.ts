import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storage_keys.ts';

export function applyThemeClass(isDark: boolean): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
}

export function initTheme(): void {
  if (typeof document === 'undefined') {
    return;
  }

  // Default to dark theme when no preference is stored
  const isDark = Storage.getBoolean(StorageKeys.IsDarkThemeEnabled, true);
  applyThemeClass(isDark);
}
