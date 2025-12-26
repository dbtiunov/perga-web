import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/index.css';
import { initConfig } from '@/config.ts'
import { initTheme } from '@common/utils/theme';

initConfig().then(async () => {
  initTheme();

  const { default: App } = await import('./App');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
