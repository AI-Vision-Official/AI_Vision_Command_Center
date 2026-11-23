import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Image, Download, Share, RefreshCw, Palette, Zap, Layers, Brain, Wand2, Share2, Upload, Trash2, Edit } from 'lucide-react';
import { saveMedia, removeMedia } from '@/lib/offline/mediaStore';
import { toast } from 'sonner';
import { ImageEditor } from './image/ImageEditor';
import { AIImageProcessor } from './image/AIImageProcessor';
import { StyleTransfer } from './image/StyleTransfer';
import { SmartSelection } from './image/SmartSelection';
import { SocialMediaExport } from './image/SocialMediaExport';
import type { CreativeAgent, ImageRequest, AccessibilityOptions } from '@/types/creative';

interface ImageCreatorProps {
  agents: CreativeAgent[];
  settings: AccessibilityOptions;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  uploaded: boolean;
}

export const ImageCreator = ({ agents, settings }: ImageCreatorProps) => {
  const [request, setRequest] = useState<Partial<ImageRequest>>({
    style: 'realistic',
    dimensions: '1:1',
    mood: 'bright',
    language: 'English'
  });
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || 
      ['.jpg', '.jpeg', '.png', '.webp', '.gif'].some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      toast.error('Please upload valid image files (.jpg, .png, .webp)');
      return;
    }

    setIsUploading(true);

    for (const file of imageFiles) {
      try {
        const imageId = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const fileName = `images/${imageId}-${file.name}`;
        
        const { url: publicUrl } = await saveMedia(fileName, file);

        const newImage: UploadedImage = {
          id: imageId,
          file,
          url: publicUrl,
          name: file.name,
          size: file.size,
          uploaded: true
        };

        setUploadedImages(prev => [...prev, newImage]);
        toast.success(`Image uploaded: ${file.name}`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteImage = async (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (image) {
      try {
        // Delete from Supabase Storage
        const fileName = `images/${imageId}-${image.name}`;
        await removeMedia(fileName);
        
        setUploadedImages(prev => prev.filter(img => img.id !== imageId));
        toast.success('Image deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete image');
      }
    }
  };

  const startEditing = (imageId: string) => {
    setActiveTab('editor');
    toast.info('Opening image editor...');
  };

  const styles = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'artistic', label: 'Artistic' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'vintage', label: 'Vintage' }
  ];

  const dimensions = [
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Landscape (16:9)' },
    { value: '9:16', label: 'Portrait (9:16)' },
    { value: '4:3', label: 'Traditional (4:3)' },
    { value: '3:4', label: 'Portrait (3:4)' }
  ];

  const moods = [
    { value: 'bright', label: 'Bright & Cheerful' },
    { value: 'dark', label: 'Dark & Moody' },
    { value: 'neutral', label: 'Neutral & Balanced' },
    { value: 'vibrant', label: 'Vibrant & Energetic' },
    { value: 'pastel', label: 'Soft & Pastel' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate image generation
    setTimeout(() => {
      const mockImages = [
        '/placeholder.svg?height=400&width=400&text=Generated+Image+1',
        '/placeholder.svg?height=400&width=400&text=Generated+Image+2',
        '/placeholder.svg?height=400&width=400&text=Generated+Image+3',
        '/placeholder.svg?height=400&width=400&text=Generated+Image+4'
      ];
      setGeneratedImages(mockImages);
      setIsGenerating(false);
    }, 3000);
  };

  const renderUploadSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Image Upload
        </CardTitle>
        <CardDescription>
          Upload your images (.jpg, .png, .webp) to start editing
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
          <p className="text-lg mb-2">Drag & drop images here</p>
          <p className="text-gray-500 mb-4">or click to browse files</p>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Choose Images
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Uploading images...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderImageLibrary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Image Library ({uploadedImages.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploadedImages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No images uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteImage(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm truncate">{image.name}</h4>
                  <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                  <div className="flex gap-1 mt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => startEditing(image.id)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${settings.dyslexiaFont ? 'font-mono' : ''}`}>
            🎨 Advanced Image Toolkit
          </h2>
          <p className={`text-gray-600 mt-1 ${settings.dyslexiaFont ? 'font-mono' : ''}`}>
            Comprehensive image creation, editing, and AI processing suite
          </p>
        </div>
        <Badge variant="outline">
          {agents.length} Visual Agents Active
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="ai-processor" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Tools
          </TabsTrigger>
          <TabsTrigger value="style-transfer" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="selection" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Selection
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <div className="space-y-6">
            {renderUploadSection()}
            {renderImageLibrary()}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Image Configuration</CardTitle>
                  <CardDescription>
                    Describe your vision and set style preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Image Description</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the image you want to create in detail..."
                      value={request.prompt || ''}
                      onChange={(e) => setRequest(prev => ({ ...prev, prompt: e.target.value }))}
                      className={`min-h-32 ${settings.dyslexiaFont ? 'font-mono' : ''}`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="style">Art Style</Label>
                    <Select value={request.style} onValueChange={(value) => setRequest(prev => ({ ...prev, style: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Select value={request.dimensions} onValueChange={(value) => setRequest(prev => ({ ...prev, dimensions: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dimensions.map((dim) => (
                          <SelectItem key={dim.value} value={dim.value}>
                            {dim.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mood">Mood & Atmosphere</Label>
                    <Select value={request.mood} onValueChange={(value) => setRequest(prev => ({ ...prev, mood: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map((mood) => (
                          <SelectItem key={mood.value} value={mood.value}>
                            {mood.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="colors">Color Scheme (optional)</Label>
                    <Input
                      id="colors"
                      placeholder="e.g., blue, gold, warm tones..."
                      onChange={(e) => setRequest(prev => ({ ...prev, colorScheme: e.target.value.split(',').map(c => c.trim()) }))}
                    />
                  </div>

                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !request.prompt}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating Images...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Images
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Generated Images</CardTitle>
                  <CardDescription>
                    Your AI-generated images with download options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {generatedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button size="sm" variant="secondary">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      <div className="text-center">
                        <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Describe your image and click "Generate Images" to begin</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <ImageEditor settings={settings} />
        </TabsContent>

        <TabsContent value="ai-processor">
          <AIImageProcessor settings={settings} />
        </TabsContent>

        <TabsContent value="style-transfer">
          <StyleTransfer settings={settings} />
        </TabsContent>

        <TabsContent value="selection">
          <SmartSelection settings={settings} />
        </TabsContent>

        <TabsContent value="export">
          <SocialMediaExport settings={settings} />
        </TabsContent>
      </Tabs>

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Creations</CardTitle>
          <CardDescription>Your image generation and editing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="relative group cursor-pointer">
                <img
                  src={`/placeholder.svg?height=150&width=150&text=Image+${i + 1}`}
                  alt={`Recent image ${i + 1}`}
                  className="w-full h-24 object-cover rounded-lg border hover:shadow-md transition-shadow"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant="secondary" className="text-xs">
                    {['realistic', 'artistic', 'minimal'][i % 3]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
