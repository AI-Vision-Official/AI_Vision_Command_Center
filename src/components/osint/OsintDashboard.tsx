import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search, ExternalLink, Flame, Siren, Video, Newspaper, BadgeCheck, Swords, Map,
  Plane, AtSign, ImageIcon, Globe, BookOpen, LayoutGrid, Github, ShieldAlert, type LucideIcon,
} from 'lucide-react';
import { osintCategories, osintTools, type OsintCategory } from './osintCatalog';

const icons: Record<OsintCategory, LucideIcon> = {
  disasters: Flame, warnings: Siren, webcams: Video, news: Newspaper, factcheck: BadgeCheck,
  conflict: Swords, maps: Map, aviation: Plane, people: AtSign, images: ImageIcon, web: Globe, frameworks: BookOpen,
};

export const OsintDashboard = () => {
  const [cat, setCat] = useState<OsintCategory | 'all'>('all');
  const [q, setQ] = useState('');
  const [osOnly, setOsOnly] = useState(false);

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return osintTools.filter((t) =>
      (cat === 'all' || t.category === cat) && (!osOnly || t.openSource) &&
      (!s || `${t.name} ${t.description} ${t.credit ?? ''}`.toLowerCase().includes(s)));
  }, [cat, q, osOnly]);

  const count = (c: OsintCategory) => osintTools.filter((t) => t.category === c).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Globe className="w-6 h-6" /> OSINT Command Dashboard</h2>
        <p className="opacity-90 mt-1">{osintTools.length} free tools: disaster tracking, warnings, live webcams, independent journalism and investigation.</p>
        <div className="mt-4 relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools, e.g. earthquake, webcam, username..." className="pl-9 bg-background text-foreground" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0 space-y-1">
          <CatButton active={cat === 'all'} icon={LayoutGrid} label="All tools" n={osintTools.length} onClick={() => setCat('all')} />
          {osintCategories.map((c) => (
            <CatButton key={c.id} active={cat === c.id} icon={icons[c.id]} label={c.label} n={count(c.id)} onClick={() => setCat(c.id)} />
          ))}
          <Button variant={osOnly ? 'default' : 'outline'} size="sm" className="w-full mt-3" onClick={() => setOsOnly(!osOnly)}>
            <Github className="w-4 h-4 mr-2" /> {osOnly ? 'Showing open source only' : 'Open source only'}
          </Button>
        </aside>

        <div className="flex-1 space-y-4">
          {cat !== 'all' && <p className="text-sm text-muted-foreground">{osintCategories.find((c) => c.id === cat)?.hint}</p>}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((t) => {
              const Icon = icons[t.category];
              return (
                <Card key={t.url} className="group hover:shadow-lg hover:border-primary/40 transition">
                  <CardContent className="p-4 flex flex-col h-full gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-primary-foreground"><Icon className="w-4 h-4" /></div>
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-tight">{t.name}</h3>
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {t.openSource && <Badge variant="secondary">Open source</Badge>}
                      {t.credit && <Badge variant="outline" className="text-xs">{t.credit}</Badge>}
                    </div>
                    <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-primary-foreground">
                      <a href={t.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" /> Open</a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {list.length === 0 && <p className="text-center text-muted-foreground py-12">No tools match your search.</p>}
        </div>
      </div>

      <Card className="border-destructive/30">
        <CardContent className="p-4 flex gap-3 text-sm text-muted-foreground">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
          <p>All tools are third-party and open in a new tab; nothing you search is stored here. Use them lawfully and respect privacy. Credits and licenses belong to the original developers. In an emergency, always follow official local authorities.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const CatButton = ({ active, icon: Icon, label, n, onClick }: { active: boolean; icon: LucideIcon; label: string; n: number; onClick: () => void }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${active ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-primary-foreground' : 'hover:bg-muted'}`}>
    <Icon className="w-4 h-4" /><span className="flex-1 text-left">{label}</span><span className="text-xs opacity-70">{n}</span>
  </button>
);
