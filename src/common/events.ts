export const REFRESH_EVENT = 'app:refresh';

/**
 * Dispatch a global refresh event. Pages/components can listen for this event and refetch their data accordingly.
 */
export const triggerRefresh = () => {
  window.dispatchEvent(new Event(REFRESH_EVENT));
};
