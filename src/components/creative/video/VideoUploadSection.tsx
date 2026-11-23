
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, HardDrive } from 'lucide-react';
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

interface VideoUploadSectionProps {
  useLocalStorage: boolean;
  offlineMode: boolean;
  isUploading: boolean;
  onVideosUploaded: (videos: UploadedVideo[]) => void;
  onUploadingChange: (uploading: boolean) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getVideoDuration = (file: File, url: string): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    const handleLoadedMetadata = () => {
      resolve(video.duration || 0);
      cleanup();
    };
    
    const handleError = (e: Event) => {
      console.error('Error loading video metadata:', e);
      resolve(0);
      cleanup();
    };
    
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.src = '';
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    
    video.crossOrigin = 'anonymous';
    video.src = url;
    
    setTimeout(() => {
      if (video.duration) {
        resolve(video.duration);
      } else {
        resolve(0);
      }
      cleanup();
    }, 5000);
  });
};

export const VideoUploadSection = ({ 
  useLocalStorage, 
  offlineMode, 
  isUploading, 
  onVideosUploaded,
  onUploadingChange 
}: VideoUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (files: FileList) => {
    const videoFiles = Array.from(files).filter(file => 
      file.type.startsWith('video/') || 
      ['.mp4', '.mov', '.webm', '.avi'].some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (videoFiles.length === 0) {
      toast.error('Please upload valid video files (.mp4, .mov, .webm)');
      return;
    }

    onUploadingChange(true);
    const uploadedVideos: UploadedVideo[] = [];

    for (const file of videoFiles) {
      try {
        const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const maxSupabaseSize = 50 * 1024 * 1024; // 50MB
        const shouldUseLocal = useLocalStorage || file.size > maxSupabaseSize || offlineMode;

        let videoUrl: string;
        let storageType: 'local' | 'supabase' = 'local';

        if (shouldUseLocal) {
          videoUrl = URL.createObjectURL(file);
          storageType = 'local';
          
          if (file.size > maxSupabaseSize) {
            toast.info(`Large file (${formatFileSize(file.size)}) stored locally`);
          }
        } else {
          const fileName = `videos/${videoId}-${file.name}`;
          
          const saved = await saveMedia(fileName, file);
          videoUrl = saved.url;
          storageType = saved.storage === 'online' ? 'supabase' : 'local';
        }

        const duration = await getVideoDuration(file, videoUrl);

        const newVideo: UploadedVideo = {
          id: videoId,
          file,
          url: videoUrl,
          name: file.name,
          size: file.size,
          duration,
          uploaded: true,
          storageType,
          localPath: storageType === 'local' ? videoUrl : undefined
        };

        uploadedVideos.push(newVideo);
        toast.success(`Video uploaded: ${file.name} (${storageType === 'local' ? 'local' : 'cloud'})`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Upload failed: ${file.name}`);
      }
    }

    onVideosUploaded(uploadedVideos);
    onUploadingChange(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Video Upload
          {useLocalStorage && (
            <Badge variant="outline" className="ml-2">
              <HardDrive className="w-3 h-3 mr-1" />
              Local
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Upload your videos (.mp4, .mov, .webm) to start editing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">Drag & drop videos here</p>
          <p className="text-gray-500 mb-4">or click to browse files</p>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Choose Videos
          </Button>
          {useLocalStorage && (
            <p className="text-xs text-green-600 mt-2">
              ✓ No file size limit - works completely offline
            </p>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,.mp4,.mov,.webm,.avi"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Uploading videos...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
