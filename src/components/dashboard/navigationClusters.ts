// Cluster definitions: every tool tab belongs to exactly one center.
// To add a new tool (e.g. an open-source GitHub project), add it to the right cluster here
// and register its component in DashboardTabs.

export type ClusterId = 'human' | 'collaborative' | 'agentic';

export interface NavTool {
  id: string;
  label: string;
  icon: string;
}

export interface Cluster {
  id: ClusterId;
  label: string;
  icon: string;
  tagline: string;
  tools: NavTool[];
}

export const clusters: Cluster[] = [
  {
    id: 'human',
    label: 'Human Center',
    icon: '👤',
    tagline: 'Human judgment, safety, verification and real-world action',
    tools: [
      { id: 'workstation', label: 'My Workstation', icon: '🏠' },
      { id: 'trust-screening', label: 'Trust & Identity Screening', icon: '🔍' },
      { id: 'survival', label: 'Survival Hub', icon: '🚨' },
      { id: 'humanitarian', label: 'Humanitarian', icon: '🌍' },
      { id: 'education', label: 'Education', icon: '🎓' },
      { id: 'security', label: 'Security Center', icon: '🔒' },
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'desktop', label: 'Desktop Apps', icon: '💻' },
    ],
  },
  {
    id: 'collaborative',
    label: 'Collaborative Space',
    icon: '🤝',
    tagline: 'Where humans and agents plan, decide and review together',
    tools: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'mission', label: 'Mission Control', icon: '🎯' },
      { id: 'boardroom', label: 'Boardroom', icon: '👔' },
      { id: 'collaboration', label: 'Agent Collaboration', icon: '👥' },
      { id: 'communication', label: 'Communication', icon: '💬' },
      { id: 'voice', label: 'Voice Control', icon: '🎤' },
      { id: 'evaluation', label: 'Evaluation', icon: '📋' },
      { id: 'actions', label: 'Quick Actions', icon: '⚡' },
      { id: 'insights', label: 'AI Insights', icon: '🧠' },
    ],
  },
  {
    id: 'agentic',
    label: 'Agentic Center',
    icon: '🤖',
    tagline: 'Autonomous agents, models, automation and generation',
    tools: [
      { id: 'agents', label: 'Agent Framework', icon: '🤖' },
      { id: 'specialized', label: 'Specialized Agents', icon: '🛡️' },
      { id: 'designer', label: 'Agent Designer', icon: '🎨' },
      { id: 'offline', label: 'Offline Models', icon: '📴' },
      { id: 'creative', label: 'Creative Studio', icon: '🖌️' },
      { id: 'marketing', label: 'Marketing AI', icon: '📢' },
      { id: 'social', label: 'Social Media', icon: '📱' },
      { id: 'web', label: 'Web Development', icon: '🌐' },
      { id: 'innovation', label: 'Innovation Hub', icon: '🔬' },
      { id: 'invention', label: 'Invention Hub', icon: '💡' },
      { id: 'templates', label: 'Template Toolkit', icon: '🧾' },
      { id: 'integrations', label: 'Integrations', icon: '🔗' },
      { id: 'ifttt', label: 'IFTTT Automation', icon: '🔄' },
      { id: 'health', label: 'System Health', icon: '💗' },
      { id: 'monitoring', label: 'Real-Time Monitor', icon: '📡' },
      { id: 'analytics', label: 'Advanced Analytics', icon: '📈' },
    ],
  },
];

export const findClusterForTool = (toolId: string): ClusterId =>
  clusters.find((c) => c.tools.some((t) => t.id === toolId))?.id ?? 'collaborative';
