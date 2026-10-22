import { useQuery } from '@tanstack/react-query';
import { parseEarthquakes, parseNaturalEvents, worldFeeds, type WorldEvent } from './worldData';

interface CachedFeed { events: WorldEvent[]; fetchedAt: number }
function readCache(key: string): CachedFeed | undefined {
  try {
    const cached = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (!Array.isArray(cached?.events) || typeof cached.fetchedAt !== 'number') return undefined;
    return cached;
  } catch { return undefined; }
}
function useFeed(key: keyof typeof worldFeeds, parser: (data: unknown) => WorldEvent[]) {
  const cacheKey = `ai-vision-world-${key}-v1`;
  const cached = readCache(cacheKey);
  return useQuery({
    queryKey: ['world-feed', key],
    initialData: cached,
    initialDataUpdatedAt: cached?.fetchedAt,
    queryFn: async (): Promise<CachedFeed> => {
      const response = await fetch(worldFeeds[key], { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`${key === 'earthquakes' ? 'USGS' : 'NASA'} feed unavailable (${response.status})`);
      const result = { events: parser(await response.json()), fetchedAt: Date.now() };
      try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch { /* Storage is optional. */ }
      return result;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
  });
}
export function useWorldFeeds() {
  const earthquakes = useFeed('earthquakes', parseEarthquakes);
  const natural = useFeed('natural', parseNaturalEvents);
  return { earthquakes, natural, events: [...(earthquakes.data?.events ?? []), ...(natural.data?.events ?? [])] };
}