import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Copy, ExternalLink, Github, Scale, Search, Sparkles, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { agentSkills, type SkillCategory } from './skillCatalog';

export const SkillCenter = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SkillCategory | 'All'>('All');
  const { toast } = useToast();

  const categories = useMemo(() => ['All', ...Array.from(new Set(agentSkills.map((s) => s.category)))] as const, []);

  const filtered = agentSkills.filter((s) => {
    const q = query.toLowerCase();
    const matches = !q || [s.name, s.tagline, s.description, s.category].some((v) => v.toLowerCase().includes(q));
    return matches && (category === 'All' || s.category === category);
  });

  const copy = async (cmd: string) => {
    await navigator.clipboard.writeText(cmd);
    toast({ title: 'Install command copied', description: cmd });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Agent Skill Center</h2>
          <p className="text-muted-foreground">Open-source skills your agents can install. Every skill is credited to its original developer.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search skills..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button key={c} size="sm" variant={category === c ? 'default' : 'outline'} onClick={() => setCategory(c)}
              className={category === c ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}>
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.id} className={s.featured ? 'border-purple-500/60 md:col-span-2 xl:col-span-3' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {s.featured && <Star className="w-4 h-4 text-purple-600" />}
                  {s.name}
                </CardTitle>
                <Badge variant="secondary">{s.category}</Badge>
              </div>
              <p className="text-sm font-medium text-blue-600">{s.tagline}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{s.description}</p>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 font-mono text-xs">
                <span className="flex-1 truncate">{s.install}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copy(s.install)} aria-label={`Copy install command for ${s.name}`}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline" className="gap-1"><Github className="w-3 h-3" />
                  by <a href={s.authorUrl} target="_blank" rel="noopener noreferrer" className="underline">{s.author}</a>
                </Badge>
                <Badge variant="outline" className="gap-1"><Scale className="w-3 h-3" />{s.license}</Badge>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={s.repoUrl} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4 mr-1" />Repository</a>
                </Button>
                {s.website && (
                  <Button asChild size="sm" variant="outline">
                    <a href={s.website} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" />Website</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground">No skills match your search.</p>}
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground flex gap-3">
          <BookOpen className="w-5 h-5 shrink-0 text-purple-600" />
          <p>
            Credits: these skills are created and maintained by their original developers and are listed here under their
            open-source licenses (MIT / Apache-2.0), which allow sharing with attribution. Always install from the official
            repository. Skills run on your own machine with your agent tools (such as Claude Code or Codex), not inside this app.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
