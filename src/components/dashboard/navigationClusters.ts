// Cluster definitions: every tool tab belongs to exactly one center.
// To add a new tool (e.g. an open-source GitHub project), add it to the right cluster here
// and register its component in DashboardTabs.

import {
  House,
  Fingerprint,
  Siren,
  HeartHandshake,
  GraduationCap,
  ShieldCheck,
  Bell,
  MonitorSmartphone,
  LayoutDashboard,
  Target,
  Briefcase,
  Users,
  MessageSquare,
  Mic,
  ClipboardCheck,
  Zap,
  Brain,
  Bot,
  ShieldHalf,
  Wand2,
  WifiOff,
  Palette,
  Megaphone,
  Smartphone,
  Globe,
  FlaskConical,
  Lightbulb,
  FileText,
  Plug,
  RefreshCw,
  HeartPulse,
  Radar,
  TrendingUp,
  UserRound,
  Cpu,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type ClusterId = 'human' | 'collaborative' | 'agentic';

export interface NavTool {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface Cluster {
  id: ClusterId;
  label: string;
  icon: LucideIcon;
  tagline: string;
  tools: NavTool[];
}

export const clusters: Cluster[] = [
  {
    id: 'human',
    label: 'Human Center',
    icon: UserRound,
    tagline: 'Human judgment, safety, verification and real-world action',
    tools: [
      { id: 'workstation', label: 'My Workstation', icon: House },
      { id: 'trust-screening', label: 'Trust & Identity Screening', icon: Fingerprint },
      { id: 'survival', label: 'Survival Hub', icon: Siren },
      { id: 'humanitarian', label: 'Humanitarian', icon: HeartHandshake },
      { id: 'education', label: 'Education', icon: GraduationCap },
      { id: 'security', label: 'Security Center', icon: ShieldCheck },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'desktop', label: 'Desktop Apps', icon: MonitorSmartphone },
    ],
  },
  {
    id: 'collaborative',
    label: 'Collaborative Space',
    icon: Users,
    tagline: 'Where humans and agents plan, decide and review together',
    tools: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'mission', label: 'Mission Control', icon: Target },
      { id: 'boardroom', label: 'Boardroom', icon: Briefcase },
      { id: 'collaboration', label: 'Agent Collaboration', icon: HeartHandshake },
      { id: 'communication', label: 'Communication', icon: MessageSquare },
      { id: 'voice', label: 'Voice Control', icon: Mic },
      { id: 'evaluation', label: 'Evaluation', icon: ClipboardCheck },
      { id: 'actions', label: 'Quick Actions', icon: Zap },
      { id: 'insights', label: 'AI Insights', icon: Brain },
    ],
  },
  {
    id: 'agentic',
    label: 'Agentic Center',
    icon: Cpu,
    tagline: 'Autonomous agents, models, automation and generation',
    tools: [
      { id: 'agents', label: 'Agent Framework', icon: Bot },
      { id: 'skills', label: 'Skill Center', icon: Sparkles },
      { id: 'specialized', label: 'Specialized Agents', icon: ShieldHalf },
      { id: 'designer', label: 'Agent Designer', icon: Wand2 },
      { id: 'offline', label: 'Offline Models', icon: WifiOff },
      { id: 'creative', label: 'Creative Studio', icon: Palette },
      { id: 'marketing', label: 'Marketing AI', icon: Megaphone },
      { id: 'social', label: 'Social Media', icon: Smartphone },
      { id: 'web', label: 'Web Development', icon: Globe },
      { id: 'innovation', label: 'Innovation Hub', icon: FlaskConical },
      { id: 'invention', label: 'Invention Hub', icon: Lightbulb },
      { id: 'templates', label: 'Template Toolkit', icon: FileText },
      { id: 'integrations', label: 'Integrations', icon: Plug },
      { id: 'ifttt', label: 'IFTTT Automation', icon: RefreshCw },
      { id: 'health', label: 'System Health', icon: HeartPulse },
      { id: 'monitoring', label: 'Real-Time Monitor', icon: Radar },
      { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
    ],
  },
];

export const findClusterForTool = (toolId: string): ClusterId =>
  clusters.find((c) => c.tools.some((t) => t.id === toolId))?.id ?? 'collaborative';
