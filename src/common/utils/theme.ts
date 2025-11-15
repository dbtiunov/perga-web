import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storageKeys';

export function applyThemeClass(isDark: boolean): void {
  if (typeof document === 'undefined'){
    return;
  }

  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
}

export function initTheme(): void {
  const isDark = Storage.getBoolean(StorageKeys.IsDarkThemeEnabled, false);
  applyThemeClass(isDark);
}
