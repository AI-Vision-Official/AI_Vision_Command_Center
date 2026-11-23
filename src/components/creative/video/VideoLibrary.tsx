
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Play, 
  Scissors, 
  Download, 
  Trash2, 
  HardDrive, 
  Globe, 
  Brain, 
  Zap, 
  Share2 
} from 'lucide-react';
import { saveMedia, removeMedia } from '@/lib/offline/mediaStore';
import { toast } from 'sonner';

interface UploadedVideo {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  duration?: number;
  uploaded: boolean;
  storageType: 'local' | 'supabase';
  localPath?: string;
}

interface VideoLibraryProps {
  videos: UploadedVideo[];
  selectedVideo: UploadedVideo | null;
  playingVideo: string | null;
  onVideoSelect: (video: UploadedVideo) => void;
  onVideoDelete: (videoId: string) => void;
  onVideoEdit: (video: UploadedVideo) => void;
  onVideoPlay: (videoId: string) => void;
  onVideoPause: (videoId: string) => void;
  onVideoProcessing: (video: UploadedVideo, tab: string) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDuration = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const VideoLibrary = ({
  videos,
  selectedVideo,
  playingVideo,
  onVideoSelect,
  onVideoDelete,
  onVideoEdit,
  onVideoPlay,
  onVideoPause,
  onVideoProcessing
}: VideoLibraryProps) => {
  const deleteVideo = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      try {
        if (video.storageType === 'supabase') {
          const fileName = `videos/${videoId}-${video.name}`;
          await removeMedia(fileName);
        } else if (video.localPath) {
          URL.revokeObjectURL(video.localPath);
        }
        
        onVideoDelete(videoId);
        toast.success('Video deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete video');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Video Library ({videos.length})
          {selectedVideo && (
            <Badge variant="secondary" className="ml-2">
              {selectedVideo.name} selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {videos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No videos uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedVideo?.id === video.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onVideoSelect(video)}
              >
                <div className="aspect-video bg-gray-900 relative">
                  <video
                    src={video.url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    controls={playingVideo === video.id}
                    muted
                    crossOrigin="anonymous"
                    onPlay={() => onVideoPlay(video.id)}
                    onPause={() => onVideoPause(video.id)}
                    onError={(e) => {
                      console.error('Video playback error:', e);
                      const target = e.target as HTMLVideoElement;
                      const error = target.error;
                      if (error) {
                        console.error('Video error details:', {
                          code: error.code,
                          message: error.message,
                          url: video.url,
                          type: video.file.type
                        });
                      }
                      toast.error(`Video playback failed: ${video.name}. Try re-uploading the file.`);
                    }}
                    onCanPlay={() => console.log('Video can play:', video.name)}
                    onLoadStart={() => console.log('Video load started:', video.name)}
                    onLoadedData={() => console.log('Video data loaded:', video.name)}
                  />
                  {playingVideo !== video.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <Button
                        size="lg"
                        className="rounded-full w-16 h-16 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const videoElement = e.currentTarget.parentElement?.parentElement?.querySelector('video') as HTMLVideoElement;
                          if (videoElement) {
                            const playPromise = videoElement.play();
                            if (playPromise) {
                              playPromise.then(() => {
                                onVideoPlay(video.id);
                              }).catch(error => {
                                console.error('Play promise rejected:', error);
                                toast.error('Could not play video. Please check the file format.');
                              });
                            }
                          }
                        }}
                      >
                        <Play className="w-8 h-8 text-white" />
                      </Button>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={video.storageType === 'local' ? 'default' : 'secondary'} className="text-xs">
                      {video.storageType === 'local' ? (
                        <>
                          <HardDrive className="w-3 h-3 mr-1" />
                          Local
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Cloud
                        </>
                      )}
                    </Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteVideo(video.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-medium truncate">{video.name}</h4>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>{formatFileSize(video.size)}</span>
                    {video.duration && <span>{formatDuration(video.duration)}</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVideoEdit(video);
                      }}
                    >
                      <Scissors className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        const a = document.createElement('a');
                        a.href = video.url;
                        a.download = video.name;
                        a.click();
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVideoProcessing(video, 'ai-processing');
                      }}
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      AI
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVideoProcessing(video, 'fractals');
                      }}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      FX
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVideoProcessing(video, 'social-publisher');
                      }}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
