import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { safeSourceUrl, type WorldEvent } from './worldData';

export function WorldMap({ events, selected, onSelect }: { events: WorldEvent[]; selected?: WorldEvent; onSelect: (event: WorldEvent) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map>();
  const markers = useRef<L.LayerGroup>();
  useEffect(() => {
    if (!host.current) return;
    const instance = L.map(host.current, { minZoom: 2, maxZoom: 16, worldCopyJump: true, scrollWheelZoom: false }).setView([20, 10], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>', maxZoom: 19 }).addTo(instance);
    map.current = instance;
    markers.current = L.layerGroup().addTo(instance);
    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(host.current);
    return () => { observer.disconnect(); instance.remove(); map.current = undefined; markers.current = undefined; };
  }, []);
  useEffect(() => {
    if (!markers.current) return;
    markers.current.clearLayers();
    const css = getComputedStyle(document.documentElement);
    const cyan = `hsl(${css.getPropertyValue('--brand-cyan')})`;
    const violet = `hsl(${css.getPropertyValue('--brand-violet')})`;
    events.forEach((event) => {
      const marker = L.circleMarker([event.lat, event.lon], { radius: event.magnitude ? Math.max(5, event.magnitude * 2) : 6, color: event.kind === 'earthquakes' ? cyan : violet, fillOpacity: 0.65, weight: 2 });
      const popup = document.createElement('div');
      const title = document.createElement('strong'); title.textContent = event.magnitude !== undefined ? `M ${event.magnitude.toFixed(1)} · ${event.title}` : event.title; popup.append(title);
      const details = document.createElement('p'); details.textContent = `${event.source} · ${new Date(event.time).toLocaleString()}`; popup.append(details);
      const url = safeSourceUrl(event.url);
      if (url) { const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'View source ↗'; popup.append(link); }
      marker.bindPopup(popup).on('click', () => onSelect(event));
      markers.current?.addLayer(marker);
    });
  }, [events, onSelect]);
  useEffect(() => { if (selected) map.current?.flyTo([selected.lat, selected.lon], 6, { animate: !matchMedia('(prefers-reduced-motion: reduce)').matches }); }, [selected]);
  return <div ref={host} className="world-map" role="region" aria-label="Interactive world event map" />;
}