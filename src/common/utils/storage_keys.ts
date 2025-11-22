/** Centralized list of localStorage keys used across the app */
export enum StorageKeys {
  // Auth
  AuthToken = 'auth:authToken',
  TokenType = 'auth:tokenType',
  RefreshToken = 'auth:refreshToken',

  // UI
  IsDarkThemeEnabled = 'ui:isDarkThemeEnabled',

  // Planner
  SelectedDate = 'planner:selectedDate',
  CollapsedAgendas = 'planner:collapsedAgendas',
  LeftPaneWidth = 'planner:leftPaneWidth',
}
