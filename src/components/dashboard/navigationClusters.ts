// Navigation map. Each tool is defined ONCE in `toolRegistry` (with its home center),
// then centers list sections that reference tool ids. A tool may appear in several centers
// (e.g. Creative Studio is home in Agentic but also handy in the Human Center).
// To add a new tool: add it to toolRegistry, place it in one or more sections,
// and register its component in DashboardTabs.

import {
  House, Fingerprint, Siren, HeartHandshake, GraduationCap, ShieldCheck, Bell,
  MonitorSmartphone, LayoutDashboard, Target, Briefcase, Users, MessageSquare, Mic,
  ClipboardCheck, Zap, Brain, Bot, ShieldHalf, Wand2, WifiOff, Palette, Megaphone,
  Smartphone, Globe, FlaskConical, Lightbulb, FileText, Plug, RefreshCw, HeartPulse,
  Radar, TrendingUp, UserRound, Cpu, Sparkles, Scale, type LucideIcon,
} from 'lucide-react';

export type ClusterId = 'human' | 'collaborative' | 'agentic';

export interface NavTool {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  home: ClusterId;
}

const t = (id: string, label: string, icon: LucideIcon, home: ClusterId, description: string): NavTool => ({
  id, label, icon, home, description,
});

export const toolRegistry: Record<string, NavTool> = Object.fromEntries(
  [
    t('workstation', 'My Workstation', House, 'human', 'Your personal start page'),
    t('trust-screening', 'Trust & Identity Screening', Fingerprint, 'human', 'Verify people, photos and sources'),
    t('survival', 'Survival Hub', Siren, 'human', 'Emergency plans, radio, checklists'),
    t('humanitarian', 'Humanitarian', HeartHandshake, 'human', 'NGO and aid work'),
    t('education', 'Education', GraduationCap, 'human', 'Learn and teach'),
    t('security', 'Security Center', ShieldCheck, 'human', 'Protect accounts and data'),
    t('notifications', 'Notifications', Bell, 'human', 'Alerts and updates'),
    t('desktop', 'Desktop Apps', MonitorSmartphone, 'human', 'Installable apps'),
    t('ethics', 'Ethics & Transparency', Scale, 'collaborative', 'Safety rules, emergency stop, human approvals'),
    t('overview', 'Overview', LayoutDashboard, 'collaborative', 'Everything at a glance'),
    t('mission', 'Mission Control', Target, 'collaborative', 'Goals and missions'),
    t('boardroom', 'Boardroom', Briefcase, 'collaborative', 'Decide together with agents'),
    t('collaboration', 'Agent Collaboration', Users, 'collaborative', 'Humans and agents working together'),
    t('communication', 'Communication', MessageSquare, 'collaborative', 'Messages and chat'),
    t('voice', 'Voice Control', Mic, 'collaborative', 'Talk to the system'),
    t('evaluation', 'Evaluation', ClipboardCheck, 'collaborative', 'Review agent results'),
    t('actions', 'Quick Actions', Zap, 'collaborative', 'One-click shortcuts'),
    t('insights', 'AI Insights', Brain, 'collaborative', 'Suggestions and trends'),
    t('agents', 'Agent Framework', Bot, 'agentic', 'Run and manage agents'),
    t('skills', 'Skill Center', Sparkles, 'agentic', 'Open-source agent skills'),
    t('specialized', 'Specialized Agents', ShieldHalf, 'agentic', 'Ready-made expert agents'),
    t('designer', 'Agent Designer', Wand2, 'agentic', 'Build your own agent'),
    t('offline', 'Offline Models', WifiOff, 'agentic', 'Local AI without internet'),
    t('creative', 'Creative Studio', Palette, 'agentic', 'Images, video, audio, card decks'),
    t('marketing', 'Marketing AI', Megaphone, 'agentic', 'Campaigns and copy'),
    t('social', 'Social Media', Smartphone, 'agentic', 'Plan and post content'),
    t('web', 'Web Development', Globe, 'agentic', 'Build websites'),
    t('innovation', 'Innovation Hub', FlaskConical, 'agentic', 'Explore new ideas'),
    t('invention', 'Invention Hub', Lightbulb, 'agentic', 'Turn ideas into inventions'),
    t('templates', 'Template Toolkit', FileText, 'agentic', 'Ready-to-use templates'),
    t('integrations', 'Integrations', Plug, 'agentic', 'Connect other services'),
    t('ifttt', 'IFTTT Automation', RefreshCw, 'agentic', 'If-this-then-that flows'),
    t('health', 'System Health', HeartPulse, 'agentic', 'Is everything running?'),
    t('monitoring', 'Real-Time Monitor', Radar, 'agentic', 'Live activity'),
    t('analytics', 'Advanced Analytics', TrendingUp, 'agentic', 'Numbers and reports'),
  ].map((tool) => [tool.id, tool])
);

export interface NavSection {
  label: string;
  tools: NavTool[];
}

export interface Cluster {
  id: ClusterId;
  label: string;
  icon: LucideIcon;
  tagline: string;
  defaultTool: string;
  sections: NavSection[];
  tools: NavTool[]; // flattened, unique
}

const section = (label: string, ids: string[]): NavSection => ({
  label,
  tools: ids.map((id) => toolRegistry[id]),
});

const cluster = (c: Omit<Cluster, 'tools'>): Cluster => ({
  ...c,
  tools: Array.from(new Map(c.sections.flatMap((s) => s.tools).map((x) => [x.id, x])).values()),
});

export const clusters: Cluster[] = [
  cluster({
    id: 'human',
    label: 'Human Center',
    icon: UserRound,
    tagline: 'Human judgment, safety, creativity and real-world action',
    defaultTool: 'workstation',
    sections: [
      section('My Space', ['workstation', 'notifications', 'actions', 'desktop']),
      section('Safety & Trust', ['ethics', 'survival', 'trust-screening', 'security']),
      section('Create & Invent', ['creative', 'innovation', 'invention', 'templates']),
      section('Help & Learn', ['humanitarian', 'education', 'communication', 'specialized']),
    ],
  }),
  cluster({
    id: 'collaborative',
    label: 'Collaborative Space',
    icon: Users,
    tagline: 'Where humans and agents plan, decide and review together',
    defaultTool: 'overview',
    sections: [
      section('Plan & Decide', ['overview', 'mission', 'boardroom']),
      section('Ethics & Safety', ['ethics', 'evaluation']),
      section('Work Together', ['collaboration', 'communication', 'voice']),
      section('Review & Learn', ['insights', 'analytics']),
    ],
  }),
  cluster({
    id: 'agentic',
    label: 'Agentic Center',
    icon: Cpu,
    tagline: 'Autonomous agents, models, automation and generation',
    defaultTool: 'agents',
    sections: [
      section('Agents & Skills', ['ethics', 'agents', 'skills', 'specialized', 'designer', 'offline']),
      section('Generate', ['creative', 'marketing', 'social', 'web', 'innovation', 'invention', 'templates']),
      section('Automate', ['integrations', 'ifttt', 'actions']),
      section('Operate', ['health', 'monitoring', 'analytics']),
    ],
  }),
];

export const allTools: NavTool[] = Object.values(toolRegistry);

/** Which centers show a tool (home center first). */
export const clustersForTool = (toolId: string): ClusterId[] => {
  const home = toolRegistry[toolId]?.home;
  const ids = clusters.filter((c) => c.tools.some((x) => x.id === toolId)).map((c) => c.id);
  return home ? [home, ...ids.filter((i) => i !== home)] : ids;
};

export const findClusterForTool = (toolId: string): ClusterId =>
  toolRegistry[toolId]?.home ?? 'collaborative';
