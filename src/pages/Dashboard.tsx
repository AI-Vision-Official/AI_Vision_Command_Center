
import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'DataAnalyst-Alpha',
      type: 'Data Analyst',
      status: 'active',
      capabilities: ['Data Processing', 'Statistical Analysis', 'Report Generation'],
      currentTask: 'Analyzing sales data for Q4 report',
      efficiency: 94,
      tasksCompleted: 47,
      spawnedAgents: 3
    },
    {
      id: '2',
      name: 'CodeReviewer-Beta',
      type: 'Code Reviewer',
      status: 'spawning',
      capabilities: ['Code Analysis', 'Bug Detection', 'Performance Optimization'],
      currentTask: 'Creating specialized testing agents',
      efficiency: 89,
      tasksCompleted: 23,
      spawnedAgents: 1
    },
    {
      id: '3',
      name: 'ProjectManager-Gamma',
      type: 'Project Manager',
      status: 'active',
      capabilities: ['Task Delegation', 'Resource Management', 'Timeline Planning'],
      currentTask: 'Coordinating team of 5 agents for product launch',
      efficiency: 97,
      tasksCompleted: 156,
      spawnedAgents: 12
    }
  ];

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Customer Sentiment Analysis',
      description: 'Analyze customer feedback from Q4 surveys',
      assignedTo: 'DataAnalyst-Alpha',
      status: 'in-progress',
      priority: 'high',
      progress: 65,
      spawnedAgents: ['SentimentAnalyzer-1', 'DataCleaner-2']
    },
    {
      id: '2',
      title: 'Automated Testing Suite',
      description: 'Create comprehensive test coverage for new features',
      assignedTo: 'CodeReviewer-Beta',
      status: 'spawning-agents',
      priority: 'medium',
      progress: 30,
      spawnedAgents: ['TestWriter-1']
    },
    {
      id: '3',
      title: 'Product Launch Coordination',
      description: 'Manage all aspects of product launch across teams',
      assignedTo: 'ProjectManager-Gamma',
      status: 'active',
      priority: 'critical',
      progress: 45,
      spawnedAgents: ['MarketingAgent-1', 'QAAgent-2', 'DocumentationAgent-3']
    }
  ];

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <DashboardHeader />
        <DashboardNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <DashboardTabs activeTab={activeTab} mockAgents={mockAgents} mockTasks={mockTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
