export type WorldLayer = 'all' | 'earthquakes' | 'natural';
export interface WorldEvent {
  id: string;
  title: string;
  kind: 'earthquakes' | 'natural';
  category: string;
  lat: number;
  lon: number;
  time: number;
  magnitude?: number;
  url: string;
  source: string;
}
export const worldFeeds = {
  earthquakes: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
  natural: 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30&limit=100',
};

export function parseEarthquakes(data: unknown): WorldEvent[] {
  const feed = data as { features?: { id: string; properties: { place: string; time: number; mag: number; url: string }; geometry: { coordinates: number[] } }[] };
  if (!Array.isArray(feed?.features)) throw new Error('USGS returned an invalid feed');
  return feed.features.flatMap(({ id, properties: p, geometry: g }) => {
    const [lon, lat] = g?.coordinates ?? [];
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(p?.time)) return [];
    return [{ id, title: p.place || 'Earthquake', kind: 'earthquakes' as const, category: 'Earthquake', lat, lon, time: p.time, magnitude: p.mag, url: p.url, source: 'USGS' }];
  });
}

export function parseNaturalEvents(data: unknown): WorldEvent[] {
  const feed = data as { events?: { id: string; title: string; categories: { title: string }[]; sources: { url: string }[]; geometry: { type: string; coordinates: number[]; date: string }[] }[] };
  if (!Array.isArray(feed?.events)) throw new Error('NASA returned an invalid feed');
  return feed.events.flatMap((event) => {
    const g = [...(event.geometry ?? [])].reverse().find((item) => item.type === 'Point');
    if (!g) return [];
    const [lon, lat] = g.coordinates;
    const time = Date.parse(g.date);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(time)) return [];
    return [{ id: event.id, title: event.title, kind: 'natural' as const, category: event.categories?.[0]?.title ?? 'Natural event', lat, lon, time, url: event.sources?.[0]?.url ?? 'https://eonet.gsfc.nasa.gov/', source: 'NASA EONET' }];
  });
}

export function filterWorldEvents(events: WorldEvent[], layer: WorldLayer, query: string) {
  const q = query.trim().toLowerCase();
  return events.filter((e) => (layer === 'all' || e.kind === layer) && `${e.title} ${e.category} ${e.source}`.toLowerCase().includes(q)).sort((a, b) => b.time - a.time);
}

export function safeSourceUrl(value: string) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : undefined; } catch { return undefined; }
}