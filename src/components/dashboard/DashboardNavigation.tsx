import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Search, X, ShieldAlert } from 'lucide-react';
import { humanAlerts, useSafety } from '@/lib/safety/safetyStore';
import { cn } from '@/lib/utils';
import {
  allTools,
  clusters,
  clustersForTool,
  findClusterForTool,
  toolRegistry,
  type ClusterId,
} from './navigationClusters';

interface DashboardNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const clusterLabel = (id: ClusterId) => clusters.find((c) => c.id === id)!.label;

export const DashboardNavigation = ({ activeTab, setActiveTab }: DashboardNavigationProps) => {
  const [activeCluster, setActiveCluster] = useState<ClusterId>(findClusterForTool(activeTab));
  const [query, setQuery] = useState('');
  const safety = useSafety();
  const alertCount = humanAlerts(safety).length;
  // Remember the last tool opened inside each center
  const [lastTool, setLastTool] = useState<Record<ClusterId, string>>(
    Object.fromEntries(clusters.map((c) => [c.id, c.defaultTool])) as Record<ClusterId, string>
  );

  // Stay in the current center when it also contains the tool; otherwise jump to its home.
  useEffect(() => {
    setActiveCluster((current) => {
      const inCurrent = clusters.find((c) => c.id === current)?.tools.some((x) => x.id === activeTab);
      const next = inCurrent ? current : findClusterForTool(activeTab);
      setLastTool((prev) => ({ ...prev, [next]: activeTab }));
      return next;
    });
  }, [activeTab]);

  const cluster = clusters.find((c) => c.id === activeCluster)!;
  const activeSection = cluster.sections.find((s) => s.tools.some((x) => x.id === activeTab));
  const activeTool = toolRegistry[activeTab];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allTools.filter(
      (x) => x.label.toLowerCase().includes(q) || x.description.toLowerCase().includes(q)
    );
  }, [query]);

  const openTool = (id: string, inCluster?: ClusterId) => {
    if (inCluster) setActiveCluster(inCluster);
    setActiveTab(id);
    setQuery('');
  };

  return (
    <nav className="mb-6 space-y-3" aria-label="Main navigation">
      {(alertCount > 0 || safety.paused) && (
        <button
          onClick={() => openTool('ethics', activeCluster === 'agentic' ? 'collaborative' : activeCluster)}
          className="flex w-full items-center gap-3 rounded-xl border border-red-300 bg-red-50 p-3 text-left text-sm text-red-800 hover:bg-red-100"
        >
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>
            {safety.paused && <strong>Emergency stop is on. </strong>}
            {alertCount > 0 && <>Human attention needed: {alertCount} safety signal{alertCount > 1 ? 's' : ''} from agents.</>}
            <span className="ml-1 underline">Open Ethics & Transparency</span>
          </span>
        </button>
      )}
      {/* Quick finder */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) openTool(results[0].id);
            if (e.key === 'Escape') setQuery('');
          }}
          placeholder="Find any tool… (e.g. creative, survival, skills)"
          aria-label="Find a tool"
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-9 text-sm text-card-foreground shadow-sm outline-none focus:ring-2 focus:ring-purple-400"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {query && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
            {results.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">No tools found.</p>
            ) : (
              results.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.id} className="flex items-center gap-3 border-b border-border p-2 last:border-0">
                    <button
                      onClick={() => openTool(tool.id)}
                      className="flex flex-1 items-center gap-3 rounded-lg p-1 text-left hover:bg-muted"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-popover-foreground">{tool.label}</span>
                        <span className="text-xs text-muted-foreground">{tool.description}</span>
                      </span>
                    </button>
                    <div className="hidden gap-1 sm:flex">
                      {clustersForTool(tool.id).map((cid) => (
                        <button
                          key={cid}
                          onClick={() => openTool(tool.id, cid)}
                          className="rounded-full border border-purple-200 px-2 py-0.5 text-[11px] text-purple-700 hover:bg-purple-50"
                        >
                          {clusterLabel(cid)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Centers */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="tablist">
        {clusters.map((c) => {
          const ClusterIcon = c.icon;
          const active = c.id === activeCluster;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={active}
              onClick={() => {
                setActiveCluster(c.id);
                setActiveTab(lastTool[c.id]);
              }}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                active
                  ? 'border-transparent bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'border-border bg-card text-card-foreground hover:border-purple-300 hover:bg-muted'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  active ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-sm'
                )}
              >
                <ClusterIcon className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="font-semibold">{c.label}</span>
                <span className={cn('text-xs', active ? 'text-white/80' : 'text-muted-foreground')}>
                  {c.tagline}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Sections with tools */}
      <div className="grid gap-2 rounded-xl border border-border bg-card p-3 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        {cluster.sections.map((s) => (
          <div key={s.label} className="space-y-1">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-purple-600">{s.label}</p>
            <div className="flex flex-col gap-0.5">
              {s.tools.map((tool) => {
                const ToolIcon = tool.icon;
                const active = activeTab === tool.id;
                const shared = tool.home !== cluster.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    aria-current={active ? 'page' : undefined}
                    title={tool.description}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium transition-colors',
                      active
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 ring-1 ring-purple-400'
                        : 'text-muted-foreground hover:bg-purple-50 hover:text-purple-700'
                    )}
                  >
                    <ToolIcon className={cn('h-4 w-4 shrink-0', active ? 'text-purple-600' : 'text-blue-500')} />
                    <span className="truncate">{tool.label}</span>
                    {shared && (
                      <span className="ml-auto rounded-full bg-blue-50 px-1.5 text-[10px] text-blue-600">shared</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Breadcrumb: where am I? */}
      {activeTool && (
        <div className="flex flex-wrap items-center gap-1 px-1 text-xs text-muted-foreground" aria-label="You are here">
          <span className="font-medium text-purple-700">{cluster.label}</span>
          {activeSection && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span>{activeSection.label}</span>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{activeTool.label}</span>
          {clustersForTool(activeTab).length > 1 && (
            <span className="ml-2">
              · also in{' '}
              {clustersForTool(activeTab)
                .filter((c) => c !== cluster.id)
                .map(clusterLabel)
                .join(', ')}
            </span>
          )}
        </div>
      )}
    </nav>
  );
};
