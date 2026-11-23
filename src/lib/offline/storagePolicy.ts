/** Decides where a file goes. Local is the default; online is opt-in and never required. */
export type StorageTarget = 'local' | 'online';

export const ONLINE_MAX_BYTES = 50 * 1024 * 1024;

export function chooseStorage(opts: { onlineEnabled: boolean; isOnline: boolean; size: number }): StorageTarget {
  if (!opts.onlineEnabled || !opts.isOnline) return 'local';
  if (opts.size > ONLINE_MAX_BYTES) return 'local';
  return 'online';
}

/** Any online failure (limits, quota, network) must fall back to local instead of failing. */
export function shouldFallBackToLocal(error: unknown): boolean {
  return error !== null && error !== undefined;
}
