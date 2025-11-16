import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storageKeys';

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

  const isDark = Storage.getBoolean(StorageKeys.IsDarkThemeEnabled);
  applyThemeClass(isDark);
}
