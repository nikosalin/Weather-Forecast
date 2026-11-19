import { useEffect } from 'react';
import { useSettingsStore } from '../schemas';

/**
 * Keeps the `dark` class on <html> in sync with the user's preference.
 * In "system" mode it also follows OS-level changes live.
 */
export function useApplyTheme(): void {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && media.matches);
      document.documentElement.classList.toggle('dark', isDark);
    };

    apply();
    if (theme !== 'system') return;

    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
}