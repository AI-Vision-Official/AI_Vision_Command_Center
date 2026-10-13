import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { clusters, findClusterForTool, type ClusterId } from './navigationClusters';

interface DashboardNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardNavigation = ({ activeTab, setActiveTab }: DashboardNavigationProps) => {
  const [activeCluster, setActiveCluster] = useState<ClusterId>(findClusterForTool(activeTab));
  // Remember the last tool opened inside each center
  const [lastTool, setLastTool] = useState<Record<ClusterId, string>>({
    human: 'workstation',
    collaborative: 'overview',
    agentic: 'agents',
  });

  useEffect(() => {
    const c = findClusterForTool(activeTab);
    setActiveCluster(c);
    setLastTool((prev) => ({ ...prev, [c]: activeTab }));
  }, [activeTab]);

  const cluster = clusters.find((c) => c.id === activeCluster)!;

  return (
    <nav className="mb-6 space-y-3" aria-label="Main navigation">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="tablist">
        {clusters.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === activeCluster}
            onClick={() => {
              setActiveCluster(c.id);
              setActiveTab(lastTool[c.id]);
            }}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
              c.id === activeCluster
                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                : 'border-border bg-card text-card-foreground hover:bg-muted'
            )}
          >
            <span className="text-2xl">{c.icon}</span>
            <span className="flex flex-col">
              <span className="font-semibold">{c.label}</span>
              <span
                className={cn(
                  'text-xs',
                  c.id === activeCluster ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}
              >
                {c.tagline}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-2 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {cluster.tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              aria-current={activeTab === tool.id ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activeTab === tool.id
                  ? 'bg-secondary text-secondary-foreground ring-1 ring-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span className="text-base">{tool.icon}</span>
              <span className="whitespace-nowrap">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
