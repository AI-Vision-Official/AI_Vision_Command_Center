import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: 'Agent Commander',
    email: 'commander@agentcore.ai',
    timezone: 'UTC',
    
    // App Customization
    customAppName: '',
    useCustomAppName: false,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    agentStatusUpdates: true,
    taskCompletionAlerts: true,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    
    // Appearance settings
    theme: 'system',
    compactMode: false,
    animationsEnabled: true,
    
    // Agent settings
    maxConcurrentAgents: '10',
    autoSpawnAgents: true,
    agentIdleTimeout: '60'
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
    onOpenChange(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your AI Vision Command Center preferences and settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="w-3 h-3" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Palette className="w-3 h-3" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              <span className="hidden sm:inline">Agents</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={settings.displayName}
                onChange={(e) => updateSetting('displayName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
              />
            </div>
            
            {/* Custom App Name Section */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="useCustomAppName">Use Custom App Name</Label>
                <Switch
                  id="useCustomAppName"
                  checked={settings.useCustomAppName}
                  onCheckedChange={(checked) => updateSetting('useCustomAppName', checked)}
                />
              </div>
              
              {settings.useCustomAppName && (
                <div className="space-y-2">
                  <Label htmlFor="customAppName">Custom App Name</Label>
                  <Input
                    id="customAppName"
                    value={settings.customAppName}
                    onChange={(e) => updateSetting('customAppName', e.target.value)}
                    placeholder="e.g., Dream Factory, Innovation Hub, Creative Command..."
                  />
                  <p className="text-sm text-gray-500">
                    This will replace "AI Vision Command Center" throughout the interface
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">GMT</SelectItem>
                  <SelectItem value="Europe/Paris">CET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="agentStatusUpdates">Agent Status Updates</Label>
              <Switch
                id="agentStatusUpdates"
                checked={settings.agentStatusUpdates}
                onCheckedChange={(checked) => updateSetting('agentStatusUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="taskCompletionAlerts">Task Completion Alerts</Label>
              <Switch
                id="taskCompletionAlerts"
                checked={settings.taskCompletionAlerts}
                onCheckedChange={(checked) => updateSetting('taskCompletionAlerts', checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Select value={settings.sessionTimeout} onValueChange={(value) => updateSetting('sessionTimeout', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="0">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compactMode">Compact Mode</Label>
              <Switch
                id="compactMode"
                checked={settings.compactMode}
                onCheckedChange={(checked) => updateSetting('compactMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="animationsEnabled">Enable Animations</Label>
              <Switch
                id="animationsEnabled"
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="maxConcurrentAgents">Max Concurrent Agents</Label>
              <Select value={settings.maxConcurrentAgents} onValueChange={(value) => updateSetting('maxConcurrentAgents', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 agents</SelectItem>
                  <SelectItem value="10">10 agents</SelectItem>
                  <SelectItem value="25">25 agents</SelectItem>
                  <SelectItem value="50">50 agents</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoSpawnAgents">Auto-spawn Sub-agents</Label>
              <Switch
                id="autoSpawnAgents"
                checked={settings.autoSpawnAgents}
                onCheckedChange={(checked) => updateSetting('autoSpawnAgents', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentIdleTimeout">Agent Idle Timeout (minutes)</Label>
              <Select value={settings.agentIdleTimeout} onValueChange={(value) => updateSetting('agentIdleTimeout', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="0">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
