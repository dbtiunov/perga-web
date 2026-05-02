/// <reference types="vite/client" />

interface Window {
  google?: {
    accounts: {
      oauth2: {
        initCodeClient: (config: {
          client_id: string;
          scope: string;
          ux_mode?: 'popup' | 'redirect';
          callback: (response: { code: string; error?: string }) => void;
        }) => { requestCode: () => void };
      };
    };
  };
}
