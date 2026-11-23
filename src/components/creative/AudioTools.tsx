
import { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Volume2, 
  Settings, 
  Activity, 
  Brain,
  Heart,
  Shield,
  Sliders,
  MessageSquare,
  Music
} from 'lucide-react';
import { saveMedia, removeMedia } from '@/lib/offline/mediaStore';
import { toast } from 'sonner';
import { VoiceCloning } from './audio/VoiceCloning';
import { NoiseReduction } from './audio/NoiseReduction';
import { TextToSpeech } from './audio/TextToSpeech';
import { AudioEnhancement } from './audio/AudioEnhancement';
import { VSTPluginBuilder } from './audio/VSTPluginBuilder';
import { AudioStreaming } from './audio/AudioStreaming';
import { VoiceCommands } from './audio/VoiceCommands';
import { EmotionAnalysis } from './audio/EmotionAnalysis';
import { AudioOverview } from './audio/AudioOverview';
import type { CreativeAgent, AccessibilityOptions } from '@/types/creative';

interface AudioToolsProps {
  agents: CreativeAgent[];
  settings: AccessibilityOptions;
}

interface UploadedAudio {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  duration?: number;
  uploaded: boolean;
}

export const AudioTools = ({ agents, settings }: AudioToolsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [uploadedAudios, setUploadedAudios] = useState<UploadedAudio[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const handleFileUpload = async (files: FileList) => {
    const audioFiles = Array.from(files).filter(file => 
      file.type.startsWith('audio/') || 
      ['.mp3', '.wav', '.ogg', '.m4a', '.flac'].some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (audioFiles.length === 0) {
      toast.error('Please upload valid audio files (.mp3, .wav, .ogg)');
      return;
    }

    setIsUploading(true);

    for (const file of audioFiles) {
      try {
        const audioId = `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const fileName = `audio/${audioId}-${file.name}`;
        
        const { url: publicUrl } = await saveMedia(fileName, file);

        const newAudio: UploadedAudio = {
          id: audioId,
          file,
          url: publicUrl,
          name: file.name,
          size: file.size,
          uploaded: true
        };

        setUploadedAudios(prev => [...prev, newAudio]);
        toast.success(`Audio uploaded: ${file.name}`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
  };

  const togglePlayback = (audioId: string) => {
    const audioElement = audioRefs.current[audioId];
    if (!audioElement) return;

    if (isPlaying[audioId]) {
      audioElement.pause();
      setIsPlaying(prev => ({ ...prev, [audioId]: false }));
    } else {
      Object.keys(isPlaying).forEach(id => {
        if (id !== audioId && isPlaying[id]) {
          audioRefs.current[id]?.pause();
          setIsPlaying(prev => ({ ...prev, [id]: false }));
        }
      });
      
      audioElement.play();
      setIsPlaying(prev => ({ ...prev, [audioId]: true }));
    }
  };

  const startProcessing = (audioId: string) => {
    setActiveTab('voice-cloning');
    toast.info('Opening audio processor...');
  };

  const audioModules = [
    {
      id: 'voice-cloning',
      title: 'Voice Cloning',
      description: 'AI-powered voice synthesis and cloning',
      icon: Mic,
      color: 'bg-blue-500',
      status: 'active',
      agents: 2
    },
    {
      id: 'noise-reduction',
      title: 'Noise Reduction',
      description: 'Real-time adaptive noise gate and cleaning',
      icon: Volume2,
      color: 'bg-green-500',
      status: 'active',
      agents: 1
    },
    {
      id: 'tts',
      title: 'Text-to-Speech',
      description: 'Emotional TTS with multilingual support',
      icon: MessageSquare,
      color: 'bg-purple-500',
      status: 'active',
      agents: 3
    },
    {
      id: 'enhancement',
      title: 'Audio Enhancement',
      description: 'AI-assisted mastering and EQ',
      icon: Sliders,
      color: 'bg-orange-500',
      status: 'active',
      agents: 2
    },
    {
      id: 'vst-builder',
      title: 'VST Plugin Builder',
      description: 'JUCE-based VST/VST3 plugin creation',
      icon: Settings,
      color: 'bg-red-500',
      status: 'beta',
      agents: 1
    },
    {
      id: 'streaming',
      title: 'Audio Streaming',
      description: 'Real-time audio processing pipeline',
      icon: Activity,
      color: 'bg-cyan-500',
      status: 'active',
      agents: 2
    },
    {
      id: 'voice-commands',
      title: 'Voice Commands',
      description: 'Voice-to-command bridge system',
      icon: Brain,
      color: 'bg-indigo-500',
      status: 'active',
      agents: 1
    },
    {
      id: 'emotion-analysis',
      title: 'Emotion Analysis',
      description: 'Emotional tone detection and tagging',
      icon: Heart,
      color: 'bg-pink-500',
      status: 'active',
      agents: 2
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${settings.dyslexiaFont ? 'font-mono' : ''}`}>
            🎵 Professional Audio Toolkit
          </h2>
          <p className={`text-gray-600 mt-1 ${settings.dyslexiaFont ? 'font-mono' : ''}`}>
            Modular AI-powered audio tools for creators and humanitarians
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Shield className="w-3 h-3 mr-1" />
            Open Source
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Heart className="w-3 h-3 mr-1" />
            Humanitarian
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="voice-cloning">Voice</TabsTrigger>
          <TabsTrigger value="noise-reduction">Noise</TabsTrigger>
          <TabsTrigger value="tts">TTS</TabsTrigger>
          <TabsTrigger value="enhancement">Enhance</TabsTrigger>
          <TabsTrigger value="vst-builder">VST</TabsTrigger>
          <TabsTrigger value="streaming">Stream</TabsTrigger>
          <TabsTrigger value="voice-commands">Commands</TabsTrigger>
          <TabsTrigger value="emotion-analysis">Emotion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AudioOverview 
            audioModules={audioModules}
            settings={settings}
            uploadedAudios={uploadedAudios}
            setUploadedAudios={setUploadedAudios}
            isUploading={isUploading}
            isRecording={isRecording}
            audioLevel={audioLevel}
            isPlaying={isPlaying}
            onFileUpload={handleFileUpload}
            togglePlayback={togglePlayback}
            startProcessing={startProcessing}
            setIsRecording={setIsRecording}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="voice-cloning">
          <VoiceCloning settings={settings} />
        </TabsContent>

        <TabsContent value="noise-reduction">
          <NoiseReduction settings={settings} />
        </TabsContent>

        <TabsContent value="tts">
          <TextToSpeech settings={settings} />
        </TabsContent>

        <TabsContent value="enhancement">
          <AudioEnhancement settings={settings} />
        </TabsContent>

        <TabsContent value="vst-builder">
          <VSTPluginBuilder settings={settings} />
        </TabsContent>

        <TabsContent value="streaming">
          <AudioStreaming settings={settings} />
        </TabsContent>

        <TabsContent value="voice-commands">
          <VoiceCommands settings={settings} />
        </TabsContent>

        <TabsContent value="emotion-analysis">
          <EmotionAnalysis settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
