
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { CreateAgentDialog } from './CreateAgentDialog';
import { SettingsDialog } from './SettingsDialog';

export const DashboardHeader = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [appName, setAppName] = useState('AI Vision Command Center');

  useEffect(() => {
    // Load custom app name from localStorage or settings
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.useCustomAppName && settings.customAppName) {
        setAppName(settings.customAppName);
      }
    }
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {appName}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base">
            Orchestrate intelligent agents to accomplish complex tasks
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1 sm:flex-none"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create Agent</span>
            <span className="sm:hidden">Create</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsSettingsDialogOpen(true)}
          >
            <Settings className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      <CreateAgentDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      
      <SettingsDialog 
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      />
    </>
  );
};
