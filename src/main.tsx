import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/index.css';
import App from '@/App';
import { initTheme } from '@common/utils/theme';
import { initConfig } from '@/config.ts'

initTheme();

initConfig().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App/>
    </StrictMode>,
  );
})
