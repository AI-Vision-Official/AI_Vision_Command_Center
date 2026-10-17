
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Mic, 
  FileText, 
  Upload, 
  Zap, 
  Music, 
  Cpu, 
  Palette, 
  DollarSign,
  Users,
  Shield,
  Plus,
  TrendingUp,
  Star
} from 'lucide-react';
import { IdeaCapture } from './IdeaCapture';
import { PrototypeTracker } from './PrototypeTracker';
import { MusicInnovationLab } from './MusicInnovationLab';
import { PatentHelper } from './PatentHelper';
import { PitchDeckBuilder } from './PitchDeckBuilder';
import { InnovationAnalytics } from './InnovationAnalytics';

export const InnovationCenter = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const innovationAreas = [
    {
      id: 'music-audio',
      name: 'Music & Audio Tech',
      description: 'VST plugins, instruments, audio processing',
      icon: Music,
      color: 'bg-purple-500',
      projects: 8,
      status: 'active'
    },
    {
      id: 'software',
      name: 'Software Solutions',
      description: 'Apps, tools, automation systems',
      icon: Cpu,
      color: 'bg-blue-500',
      projects: 12,
      status: 'active'
    },
    {
      id: 'creative-tools',
      name: 'Creative Tools',
      description: 'Design software, artistic instruments',
      icon: Palette,
      color: 'bg-green-500',
      projects: 6,
      status: 'research'
    },
    {
      id: 'ai-assisted',
      name: 'AI-Powered Innovations',
      description: 'Machine learning applications, smart tools',
      icon: Zap,
      color: 'bg-orange-500',
      projects: 4,
      status: 'prototype'
    }
  ];

  const recentIdeas = [
    {
      id: 'vst-emotion-mapper',
      title: 'Emotion-Driven VST Plugin',
      description: 'VST that adapts sound parameters based on emotional input from lyrics or performance',
      category: 'Music & Audio Tech',
      priority: 'high',
      stage: 'concept',
      aiSuggestions: 3,
      lastUpdated: '2 hours ago'
    },
    {
      id: 'adaptive-ui-framework',
      title: 'Adaptive UI Framework',
      description: 'Interface that learns user preferences and adapts layout/controls dynamically',
      category: 'Software Solutions',
      priority: 'medium',
      stage: 'research',
      aiSuggestions: 7,
      lastUpdated: '1 day ago'
    },
    {
      id: 'collaborative-daw',
      title: 'Real-time Collaborative DAW',
      description: 'Multi-user music production with live sync and conflict resolution',
      category: 'Music & Audio Tech',
      priority: 'high',
      stage: 'prototype',
      aiSuggestions: 12,
      lastUpdated: '3 days ago'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🔬 Innovation Hub</h2>
          <p className="text-gray-600 mt-1">
            Capture, develop, and prototype your musical and technical innovations
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Innovation
          </Button>
          <Button variant="outline">
            <Mic className="w-4 h-4 mr-2" />
            Voice Capture
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Active Projects</p>
                <p className="text-2xl font-bold text-purple-700">30</p>
              </div>
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Prototypes Built</p>
                <p className="text-2xl font-bold text-blue-700">12</p>
              </div>
              <Cpu className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">AI Suggestions</p>
                <p className="text-2xl font-bold text-green-700">247</p>
              </div>
              <Zap className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Market Potential</p>
                <p className="text-2xl font-bold text-orange-700">€85K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Innovation Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {innovationAreas.map((area) => (
          <Card 
            key={area.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow border-l-4"
            style={{ borderLeftColor: area.color.replace('bg-', '').replace('-500', '') }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${area.color} text-white`}>
                    <area.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{area.name}</CardTitle>
                    <Badge 
                      variant={area.status === 'active' ? 'default' : 'secondary'} 
                      className="text-xs mt-1"
                    >
                      {area.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {area.projects} projects
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{area.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Ideas */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Innovation Ideas</CardTitle>
          <CardDescription>
            Your latest captured ideas with AI enhancement suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIdeas.map((idea) => (
              <div key={idea.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{idea.title}</h4>
                    <Badge 
                      variant={idea.priority === 'high' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {idea.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {idea.stage}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Category: {idea.category}</span>
                    <span>AI Suggestions: {idea.aiSuggestions}</span>
                    <span>Updated: {idea.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Enhance
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Develop
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capture">Idea Capture</TabsTrigger>
          <TabsTrigger value="prototypes">Prototypes</TabsTrigger>
          <TabsTrigger value="music-lab">Music Lab</TabsTrigger>
          <TabsTrigger value="patents">Patents</TabsTrigger>
          <TabsTrigger value="pitch">Pitch Deck</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="capture">
          <IdeaCapture />
        </TabsContent>

        <TabsContent value="prototypes">
          <PrototypeTracker />
        </TabsContent>

        <TabsContent value="music-lab">
          <MusicInnovationLab />
        </TabsContent>

        <TabsContent value="patents">
          <PatentHelper />
        </TabsContent>

        <TabsContent value="pitch">
          <PitchDeckBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};
