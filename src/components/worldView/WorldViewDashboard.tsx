import { useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { Globe, RefreshCw, Moon, Sun, Search, ExternalLink, ShieldCheck, Radio, CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import officialLogo from '@/assets/ai-vision-official-logo.png.asset.json';
import { useWorldFeeds } from './useWorldFeeds';
import { filterWorldEvents, safeSourceUrl, type WorldEvent, type WorldLayer } from './worldData';
import { WorldMap } from './WorldMap';
import { WorldSources } from './WorldSources';

export function WorldViewDashboard() {
  const { earthquakes, natural, events } = useWorldFeeds();
  const [layer, setLayer] = useState<WorldLayer>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<WorldEvent>();
  const [view, setView] = useState<'events' | 'weather'>('events');
  const { resolvedTheme, setTheme } = useTheme();
  const filtered = useMemo(() => filterWorldEvents(events, layer, query), [events, layer, query]);
  const fetching = earthquakes.isFetching || natural.isFetching;
  const feedStatus = (name: string, feed: typeof earthquakes) => <span className="inline-flex gap-2 items-center"><span className={`w-2 h-2 rounded-full ${feed.isError ? 'bg-signal' : feed.data ? 'bg-brand-cyan' : 'bg-muted-foreground'}`} />{name}: {feed.isError ? (feed.data ? 'cached · refresh failed' : 'unavailable') : feed.data ? `updated ${new Date(feed.data.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'connecting…'}</span>;
  return <main className="space-y-6" aria-label="AI Vision Official World View">
    <header className="border-b border-border pb-5 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
      <div className="flex items-center gap-4 min-w-0">
        <img src={officialLogo.url} alt="AI Vision Official" className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg bg-brand-ink shrink-0" />
        <div><p className="text-xs uppercase font-semibold text-primary">AI Vision Official</p><h2 className="text-3xl sm:text-4xl font-bold mt-1">World View</h2><p className="text-muted-foreground mt-2 text-sm">A shared world. Clearer perspective. Human judgment first.</p></div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title="Change theme" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>{resolvedTheme === 'dark' ? <Sun /> : <Moon />}</Button>
        <Button variant="outline" disabled={fetching} onClick={() => { void earthquakes.refetch(); void natural.refetch(); }}><RefreshCw className={fetching ? 'animate-spin motion-reduce:animate-none' : ''} />{fetching ? 'Updating' : 'Refresh feeds'}</Button>
      </div>
    </header>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-border pb-5">
      {[
        { label: 'Earthquakes · past 24h · M 2.5+', value: earthquakes.data ? earthquakes.data.events.length : '—', icon: Radio },
        { label: 'Open natural events · past 30 days', value: natural.data ? natural.data.events.length : '—', icon: Globe },
        { label: 'Matching events', value: events.length ? filtered.length : '—', icon: Search },
        { label: 'Observation, not prediction', value: 'Source-led', icon: ShieldCheck },
      ].map(({ label, value, icon: Icon }) => <div key={label}><div className="flex gap-2 text-primary items-center"><Icon className="w-4 h-4" /><span className="text-2xl font-semibold text-foreground">{value}</span></div><p className="text-xs text-muted-foreground mt-1">{label}</p></div>)}
    </div>
    <section className="space-y-3" aria-label="Live world monitoring">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2"><Button variant={view === 'events' ? 'default' : 'outline'} aria-pressed={view === 'events'} onClick={() => setView('events')}><Globe />World events</Button><Button variant={view === 'weather' ? 'default' : 'outline'} aria-pressed={view === 'weather'} onClick={() => setView('weather')}><CloudSun />Weather</Button></div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground" role="status">{feedStatus('USGS', earthquakes)}{feedStatus('NASA', natural)}</div>
      </div>
      {view === 'events' ? <>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-1">{([{ id: 'all', label: 'All events' }, { id: 'earthquakes', label: 'Earthquakes' }, { id: 'natural', label: 'Natural events' }] as const).map((item) => <Button key={item.id} size="sm" variant={layer === item.id ? 'secondary' : 'ghost'} aria-pressed={layer === item.id} onClick={() => { setLayer(item.id); setSelected(undefined); }}>{item.label}</Button>)}</div>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search world events" placeholder="Search place or event" className="sm:ml-auto sm:w-64" />
        </div>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-0 border border-border rounded-lg overflow-hidden bg-card">
          <WorldMap events={filtered} selected={selected} onSelect={setSelected} />
          <aside className="h-[380px] sm:h-[520px] overflow-y-auto border-t lg:border-t-0 lg:border-l border-border" aria-label="Latest world events">
            <h3 className="sticky top-0 bg-card border-b border-border p-3 text-sm font-semibold z-10">Latest observations <span className="text-muted-foreground">· {filtered.length}</span></h3>
            {filtered.map((event) => <div key={event.id} className={`p-3 border-b border-border ${selected?.id === event.id ? 'bg-accent' : ''}`}>
              <Button variant="ghost" className="h-auto w-full p-0 text-left justify-start whitespace-normal hover:bg-transparent" onClick={() => setSelected(event)}><span className="block"><span className={`block text-xs mb-1 ${event.kind === 'earthquakes' ? 'text-primary' : 'text-brand-violet'}`}>{event.magnitude !== undefined ? `M ${event.magnitude.toFixed(1)} · Earthquake` : event.category}</span><span className="text-sm font-medium">{event.title}</span></span></Button>
              <div className="flex justify-between gap-2 mt-2 text-xs text-muted-foreground"><time dateTime={new Date(event.time).toISOString()}>{new Date(event.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>{safeSourceUrl(event.url) && <a href={safeSourceUrl(event.url)} target="_blank" rel="noopener noreferrer" className="text-primary inline-flex gap-1 items-center">{event.source}<ExternalLink className="w-3 h-3" /></a>}</div>
            </div>)}
            {!filtered.length && <p className="p-5 text-sm text-muted-foreground">{fetching && !events.length ? 'Connecting to public feeds…' : events.length ? 'No events match your filters.' : 'No event data available. Refresh the feeds or consult the official sources below.'}</p>}
          </aside>
        </div>
        <p className="text-xs text-muted-foreground flex flex-wrap gap-4"><span className="flex gap-2 items-center"><span className="h-2 w-2 rounded-full bg-brand-cyan" />USGS earthquakes</span><span className="flex gap-2 items-center"><span className="h-2 w-2 rounded-full bg-brand-violet" />NASA natural events</span><span>Times shown in your local timezone. Event feeds update every five minutes.</span></p>
      </> : <div className="space-y-2"><iframe title="Windy live weather map" src="https://embed.windy.com/embed2.html?lat=20&lon=10&detailLat=20&detailLon=10&width=1000&height=520&zoom=3&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1" className="w-full h-[520px] border border-border rounded-lg" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /><p className="text-xs text-muted-foreground">Weather visualization by Windy. Forecasts are not emergency warnings. <a className="text-primary underline" href="https://www.windy.com/" target="_blank" rel="noopener noreferrer">Open Windy ↗</a></p></div>}
    </section>
    <WorldSources />
    <footer className="border-t border-border pt-5 space-y-3 text-xs text-muted-foreground">
      <p className="flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0 text-primary" /><span>This is an information dashboard, not an emergency alert service. Data can be delayed, incomplete or incorrect. Follow official local authorities. Only public event feeds are cached on this device; searches are not saved. Maps and external sources receive ordinary connection information.</span></p>
      <p>AI Vision Official · Human and AI, moving forward together. Original AI Vision layout; inspiration: <a href="https://pavindas.github.io/osint/" target="_blank" rel="noopener noreferrer" className="underline">PavinDas OSINT</a>. No reference code or assets reused. Map: Leaflet (BSD-2-Clause), OpenStreetMap contributors (ODbL). Event data: USGS and NASA EONET. External content remains with its original publishers.</p>
    </footer>
  </main>;
}