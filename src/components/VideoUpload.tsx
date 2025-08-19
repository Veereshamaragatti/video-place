import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Video, FileX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onFileUpload: (file: File) => void;
}

export const VideoUpload = ({ onFileUpload }: VideoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    setError(null);
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError("Please select a video file");
      toast({
        title: "Invalid file type",
        description: "Please select a video file (MP4, AVI, MOV, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError("File size must be less than 100MB");
      toast({
        title: "File too large",
        description: "Please select a video file smaller than 100MB",
        variant: "destructive",
      });
      return;
    }
    
    onFileUpload(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="glass">
      <div className="p-8">
        <div className="text-center mb-8">
          <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Upload a Video to Get Started</h2>
          <p className="text-muted-foreground">
            Drag and drop your video file here, or click to browse
          </p>
        </div>

        <div
          className={`upload-area p-12 text-center ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
            isDragOver ? 'text-primary' : 'text-muted-foreground'
          }`} />
          
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragOver ? 'Drop your video here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports MP4, AVI, MOV, and other video formats (max 100MB)
            </p>
          </div>

          <Button 
            variant="outline" 
            className="mt-6"
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            Select File
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
            <FileX className="w-5 h-5 text-destructive" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  );
};