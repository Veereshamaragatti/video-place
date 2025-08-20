import { useState } from "react";
import { VideoUpload } from "@/components/VideoUpload";
import { ProcessingState } from "@/components/ProcessingState";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useToast } from "@/hooks/use-toast";

type AppState = "upload" | "processing" | "completed";

interface VideoData {
  url: string;
  transcript: Array<{
    word: string;
    start: number;
    end: number;
  }>;
  summary?: string;
}

const Index = () => {
  const [state, setState] = useState<AppState>("upload");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    console.log("Uploading file:", file.name);
    setState("processing");
    
    // Simulate processing with progress updates
    simulateProcessing();
  };

  const simulateProcessing = () => {
    const steps = [
      { progress: 20, message: "Extracting Audio..." },
      { progress: 40, message: "Denoising Audio..." },
      { progress: 60, message: "Transcribing Speech..." },
      { progress: 80, message: "Processing Video..." },
      { progress: 100, message: "Finalizing..." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProcessingProgress(steps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        // Simulate completed processing with the actual processed video
        setTimeout(() => {
          setVideoData({
            url: "/processed-video.mp4",
            transcript: generateMockTranscript(),
          });
          setState("completed");
          toast({
            title: "Video processed successfully!",
            description: "Your video is ready with interactive transcript.",
          });
        }, 1000);
      }
    }, 1500);
  };

  const generateMockTranscript = () => {
    const words = [
      "Welcome", "to", "our", "video", "processing", "application.", "This", "is", "a", "demonstration",
      "of", "how", "interactive", "transcripts", "work.", "Each", "word", "is", "clickable", "and",
      "will", "jump", "to", "the", "corresponding", "timestamp", "in", "the", "video.", "You", "can",
      "also", "search", "for", "specific", "words", "or", "phrases", "using", "the", "search", "bar",
      "above.", "The", "transcript", "provides", "an", "excellent", "way", "to", "navigate", "through",
      "long", "videos", "quickly", "and", "efficiently.", "Machine", "learning", "makes", "this", "possible."
    ];
    
    return words.map((word, index) => ({
      word,
      start: index * 0.5,
      end: (index + 1) * 0.5,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Video Palace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your videos with AI-powered processing, interactive transcripts, and intelligent summaries
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          {state === "upload" && (
            <VideoUpload onFileUpload={handleFileUpload} />
          )}
          
          {state === "processing" && (
            <ProcessingState progress={processingProgress} />
          )}
          
          {state === "completed" && videoData && (
            <VideoPlayer videoData={videoData} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;