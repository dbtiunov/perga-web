import { getConfig } from '@/config';

type CodeClient = {
  requestCode: () => void;
};

let codeClient: CodeClient | null = null;

interface GoogleInitializeOptions {
  callback: (response: { code: string; error?: string }) => void;
}

export const initializeGoogleCodeClient = (options: GoogleInitializeOptions) => {
  const { GOOGLE_CLIENT_ID } = getConfig();

  if (!window.google?.accounts?.oauth2 || !GOOGLE_CLIENT_ID) {
    return false;
  }

  if (codeClient) {
    return true;
  }

  codeClient = window.google.accounts.oauth2.initCodeClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'openid email profile',
    ux_mode: 'popup',
    callback: options.callback,
  });

  return true;
};

export const requestGoogleCode = () => {
  if (codeClient) {
    codeClient.requestCode();
    return true;
  }
  return false;
};
