
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileAudio, Music, Play, Pause, BarChart3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveMedia, removeMedia } from '@/lib/offline/mediaStore';

interface UploadedAudio {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  duration?: number;
  uploaded: boolean;
}

interface AudioLibraryProps {
  uploadedAudios: UploadedAudio[];
  setUploadedAudios: React.Dispatch<React.SetStateAction<UploadedAudio[]>>;
  isPlaying: { [key: string]: boolean };
  togglePlayback: (audioId: string) => void;
  startProcessing: (audioId: string) => void;
}

export const AudioLibrary = ({ 
  uploadedAudios, 
  setUploadedAudios, 
  isPlaying, 
  togglePlayback, 
  startProcessing 
}: AudioLibraryProps) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteAudio = async (audioId: string) => {
    const audio = uploadedAudios.find(a => a.id === audioId);
    if (audio) {
      try {
        const fileName = `audio/${audioId}-${audio.name}`;
        await removeMedia(fileName);
        
        setUploadedAudios(prev => prev.filter(a => a.id !== audioId));
        toast.success('Audio deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete audio');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileAudio className="w-5 h-5" />
          Audio Library ({uploadedAudios.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploadedAudios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileAudio className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No audio files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {uploadedAudios.map((audio) => (
              <Card key={audio.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{audio.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(audio.size)}
                      {audio.duration && ` • ${formatDuration(audio.duration)}`}
                    </p>
                    
                    <div className="mt-2 h-8 bg-gray-100 rounded flex items-center px-2">
                      <div className="flex items-end gap-1 h-4">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-blue-400 rounded-sm"
                            style={{
                              width: '2px',
                              height: `${Math.random() * 100}%`,
                              minHeight: '2px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePlayback(audio.id)}
                    >
                      {isPlaying[audio.id] ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => startProcessing(audio.id)}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Process
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteAudio(audio.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <audio
                  ref={(el) => {
                    if (el) audioRefs.current[audio.id] = el;
                  }}
                  src={audio.url}
                  onEnded={() => {
                    // This would need to be passed as a prop or managed by parent
                  }}
                  onLoadedMetadata={(e) => {
                    const target = e.target as HTMLAudioElement;
                    setUploadedAudios(prev => 
                      prev.map(a => 
                        a.id === audio.id 
                          ? { ...a, duration: target.duration }
                          : a
                      )
                    );
                  }}
                />
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
