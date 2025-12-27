interface Config {
  API_BASE_URL: string;
  IS_SIGNUP_DISABLED: boolean;
}

let config: Config | null = null;

/**
 * Load config.json before app init
 */
export async function initConfig(): Promise<Config> {
  try {
    const response = await fetch('/config.json', { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }

    config = await response.json();
  } catch {
    config = null;
  }

  if (!config) {
    console.error('Error loading config');

    // use default config
    config = {
      API_BASE_URL: 'http://localhost:8000',
      IS_SIGNUP_DISABLED: false
    };
  }

  return config;
}

export function getConfig(): Config {
  if (!config) {
    void initConfig();
  }

  return config as Config;
}
