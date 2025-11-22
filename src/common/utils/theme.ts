import Storage from '@common/utils/storage';
import { Storage_keys } from '@common/utils/storage_keys.ts';

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

  const isDark = Storage.getBoolean(Storage_keys.IsDarkThemeEnabled);
  applyThemeClass(isDark);
}
