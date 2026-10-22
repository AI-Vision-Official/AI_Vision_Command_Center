import { DashboardOverview } from './DashboardOverview';
import { PersonalWorkstation } from '../workstation/PersonalWorkstation';
import { OfflineCenter } from '../offline/OfflineCenter';
import { SocialMediaCenter } from '../socialMedia/SocialMediaCenter';
import { MissionControlCenter } from '../missionControl/MissionControlCenter';
import { HumanitarianCenter } from '../humanitarian/HumanitarianCenter';
import { WebDevelopmentCenter } from '../webDevelopment/WebDevelopmentCenter';
import { EducationCenter } from '../education/EducationCenter';
import { CreativeCenter } from '../creative/CreativeCenter';
import { MarketingAICenter } from '../marketing/MarketingAICenter';
import { InventionCenter } from '../invention/InventionCenter';
import { IntegrationsCenter } from '../integrations/IntegrationsCenter';
import { IFTTTCenter } from '../ifttt/IFTTTCenter';
import { BoardroomCenter } from '../boardroom/BoardroomCenter';
import { AgentFrameworkCenter } from '../agents/AgentFrameworkCenter';
import { SpecializedAgentsCenter } from '../agents/SpecializedAgentsCenter';
import { SecurityCenter } from '../security/SecurityCenter';
import { TrustScreeningCenter } from '../trustScreening/TrustScreeningCenter';
import { SurvivalCenter } from '../survival/SurvivalCenter';
import { EvaluationSystem } from '../evaluation/EvaluationSystem';
import { AgentHealthDashboard } from '../monitoring/AgentHealthDashboard';
import { SmartNotificationSystem } from '../notifications/SmartNotificationSystem';
import { QuickActionsPanel } from '../quickActions/QuickActionsPanel';
import { AgentCollaborationHub } from '../agents/AgentCollaborationHub';
import { VoiceCommandInterface } from '../voice/VoiceCommandInterface';
import { CommunicationCenter } from '../agents/CommunicationCenter';
import { DesktopWrapper } from '../desktop/DesktopWrapper';
import { AdvancedAnalyticsDashboard } from '../analytics/AdvancedAnalyticsDashboard';
import { CustomAgentDesigner } from '../agents/CustomAgentDesigner';
import { RealTimeMonitoring } from '../monitoring/RealTimeMonitoring';
import { AIInsightsEngine } from '../insights/AIInsightsEngine';
import { TemplateManager } from '../templates/TemplateManager';
import { InnovationCenter } from '../innovation/InnovationCenter';
import { SkillCenter } from '../skills/SkillCenter';
import { OsintDashboard } from '../osint/OsintDashboard';
import { WorldViewDashboard } from '../worldView/WorldViewDashboard';
import { EthicsTransparencyCenter } from '../ethics/EthicsTransparencyCenter';
import { mockSocialMediaAgents } from '@/data/mockSocialMediaData';
import { mockHumanitarianProjects, mockCrisisAlerts } from '@/data/mockHumanitarianData';
import { mockWebAgents, mockWebProjects } from '@/data/mockWebData';
import { mockCreativeAgents } from '@/data/mockCreativeData';
import { 
  mockIFTTTRules, 
  mockIFTTTPlatforms, 
  mockIFTTTLogs, 
  mockIFTTTStats 
} from '@/data/mockIFTTTData';
import type { Agent as FrameworkAgent } from '@/types/agentFramework';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'spawning' | 'error';
  capabilities: string[];
  currentTask: string;
  efficiency: number;
  tasksCompleted: number;
  spawnedAgents: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'active' | 'pending' | 'in-progress' | 'spawning-agents' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  spawnedAgents: string[];
}

interface DashboardTabsProps {
  activeTab: string;
  mockAgents: Agent[];
  mockTasks: Task[];
}

export const DashboardTabs = ({ activeTab, mockAgents, mockTasks }: DashboardTabsProps) => {
  const mockBoardroomSettings = {
    workspaceTheme: 'professional' as const,
    notificationLevel: 'important' as const,
    autoSave: true,
    collaborationMode: 'team' as const,
    dyslexiaFont: false,
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    keyboardNavigation: false,
    screenReader: false,
    colorBlindSupport: false,
    focusIndicators: true,
    voiceToText: false,
    textToSpeech: false,
    quietMode: false,
    focusMode: false
  };

  // Convert mockAgents to the format expected by CommunicationCenter
  const communicationAgents: FrameworkAgent[] = mockAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    role: {
      id: `role-${agent.id}`,
      name: agent.type,
      type: 'specialist' as const,
      department: 'operations' as const,
      responsibilities: agent.capabilities,
      requiredCapabilities: agent.capabilities,
      autonomyLevel: 'medium' as const,
      canSpawnAgents: true,
      maxSubordinates: 5,
      communicationChannels: [],
      securityClearance: 'internal' as const
    },
    status: agent.status,
    subordinateIds: [],
    currentTasks: [],
    workload: 75,
    efficiency: agent.efficiency,
    specializations: agent.capabilities,
    createdAt: new Date(),
    lastActive: new Date(),
    communicationPreferences: [],
    version: '1.0.0',
    metrics: {
      tasksCompleted: agent.tasksCompleted,
      averageTaskTime: 120,
      successRate: 95,
      collaborationScore: 85,
      innovationIndex: 78,
      agentsSpawned: agent.spawnedAgents,
      communicationEfficiency: 92,
      uptime: 99.5
    }
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'workstation':
        return <PersonalWorkstation />;
      case 'offline':
        return <OfflineCenter />;
      case 'desktop':
        return <DesktopWrapper />;
      case 'collaboration':
        return <AgentCollaborationHub />;
      case 'voice':
        return <VoiceCommandInterface />;
      case 'communication':
        return <CommunicationCenter agents={communicationAgents} />;
      case 'analytics':
        return <AdvancedAnalyticsDashboard />;
      case 'designer':
        return <CustomAgentDesigner />;
      case 'monitoring':
        return <RealTimeMonitoring />;
      case 'insights':
        return <AIInsightsEngine />;
      case 'security':
        return <SecurityCenter />;
      case 'osint':
        return <OsintDashboard />;
      case 'world-view':
        return <WorldViewDashboard />;
      case 'trust-screening':
        return <TrustScreeningCenter />;
      case 'survival':
        return <SurvivalCenter />;
      case 'social':
        return <SocialMediaCenter agents={mockSocialMediaAgents} />;
      case 'mission':
        return <MissionControlCenter agents={mockAgents} tasks={mockTasks} />;
      case 'humanitarian':
        return <HumanitarianCenter projects={mockHumanitarianProjects} alerts={mockCrisisAlerts} />;
      case 'web':
        return <WebDevelopmentCenter agents={mockWebAgents} projects={mockWebProjects} />;
      case 'education':
        return <EducationCenter />;
      case 'creative':
        return <CreativeCenter agents={mockCreativeAgents} />;
      case 'marketing':
        return <MarketingAICenter />;
      case 'invention':
        return <InventionCenter />;
      case 'integrations':
        return <IntegrationsCenter />;
      case 'ifttt':
        return <IFTTTCenter 
          rules={mockIFTTTRules} 
          platforms={mockIFTTTPlatforms} 
          executionLogs={mockIFTTTLogs} 
          stats={mockIFTTTStats} 
        />;
      case 'boardroom':
        return <BoardroomCenter settings={mockBoardroomSettings} />;
      case 'agents':
        return <AgentFrameworkCenter />;
      case 'ethics':
        return <EthicsTransparencyCenter />;
      case 'skills':
        return <SkillCenter />;
      case 'specialized':
        return <SpecializedAgentsCenter />;
      case 'evaluation':
        return <EvaluationSystem agents={mockAgents} tasks={mockTasks} />;
      case 'health':
        return <AgentHealthDashboard />;
      case 'notifications':
        return <SmartNotificationSystem />;
      case 'actions':
        return <QuickActionsPanel />;
      case 'templates':
        return <TemplateManager />;
      case 'innovation':
        return <InnovationCenter />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="mt-6">
      {renderTabContent()}
    </div>
  );
};
