import { useState } from 'react';
import { ExternalLink, Siren, Video, Newspaper, Satellite, Plane, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { osintTools, type OsintCategory } from '@/components/osint/osintCatalog';

const groups: { id: OsintCategory; label: string; icon: typeof Siren }[] = [
  { id: 'warnings', label: 'Official warnings', icon: Siren },
  { id: 'webcams', label: 'Public webcams', icon: Video },
  { id: 'news', label: 'Independent journalism', icon: Newspaper },
  { id: 'maps', label: 'Satellite & maps', icon: Satellite },
  { id: 'aviation', label: 'Air & sea', icon: Plane },
  { id: 'factcheck', label: 'Verification', icon: ShieldCheck },
];
export function WorldSources() {
  const [category, setCategory] = useState<OsintCategory>('warnings');
  const [query, setQuery] = useState('');
  const sources = osintTools.filter((t) => t.category === category && `${t.name} ${t.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="border-t border-border pt-6 space-y-4" aria-labelledby="world-sources-heading">
    <div className="flex flex-wrap gap-3 justify-between items-center">
      <h3 id="world-sources-heading" className="text-xl font-semibold">Beyond the map</h3>
      <Input aria-label="Search world sources" placeholder="Search sources" value={query} onChange={(e) => setQuery(e.target.value)} className="sm:w-64" />
    </div>
    <div className="flex flex-wrap gap-2" aria-label="Source categories">{groups.map(({ id, label, icon: Icon }) => <Button key={id} size="sm" variant={category === id ? 'default' : 'outline'} aria-pressed={category === id} onClick={() => { setCategory(id); setQuery(''); }}><Icon />{label}</Button>)}</div>
    {category === 'news' && <p className="text-sm text-muted-foreground">Independent does not mean infallible. Compare reporting, examine evidence and check original sources. Some publishers limit free access.</p>}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg border border-border bg-card p-4 hover:border-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className="flex justify-between gap-2"><h4 className="font-semibold">{s.name === 'Insecam directory' ? 'Webcam Taxi' : s.name}</h4><ExternalLink className="w-4 h-4 shrink-0 text-primary" /></div>
      <p className="text-sm text-muted-foreground mt-1">{s.description}</p><p className="text-xs text-muted-foreground mt-3">{s.credit ?? s.name} · External source</p>
    </a>)}</div>
    {!sources.length && <p className="text-muted-foreground">No sources match your search.</p>}
  </section>;
}