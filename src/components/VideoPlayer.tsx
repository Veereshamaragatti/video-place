import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Sparkles, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoData {
  url: string;
  transcript: Array<{
    word: string;
    start: number;
    end: number;
  }>;
  summary?: string;
}

interface VideoPlayerProps {
  videoData: VideoData;
}

export const VideoPlayer = ({ videoData }: VideoPlayerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [summary, setSummary] = useState(videoData.summary || "");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleWordClick = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    
    // Simulate AI summary generation
    setTimeout(() => {
      const mockSummary = `
        • This video demonstrates an advanced video processing application with AI capabilities
        • Interactive transcripts allow users to click on any word to jump to that timestamp
        • The application features real-time search functionality across the entire transcript
        • Machine learning algorithms are used for audio extraction, denoising, and speech recognition
        • The user interface is designed with modern principles focusing on usability and visual appeal
        • Video processing includes multiple stages: audio extraction, noise reduction, transcription, and finalization
      `;
      setSummary(mockSummary.trim());
      setIsGeneratingSummary(false);
      toast({
        title: "Summary generated!",
        description: "AI has analyzed your video and created a summary.",
      });
    }, 2000);
  };

  const filteredTranscript = videoData.transcript.filter(item =>
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrentWord = () => {
    return videoData.transcript.find(
      item => currentTime >= item.start && currentTime <= item.end
    );
  };

  const currentWord = getCurrentWord();

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card className="glass overflow-hidden">
        <div className="relative">
          <video
            ref={videoRef}
            src={videoData.url}
            controls
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full aspect-video bg-black"
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Custom Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Button
              onClick={togglePlayPause}
              size="lg"
              className="pointer-events-auto bg-black/50 hover:bg-black/70 border-2 border-white/20 backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Transcript Section */}
      <Card className="glass">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Interactive Transcript</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transcript..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <ScrollArea className="h-64 custom-scrollbar">
            <div className="space-y-1 p-4">
              {(searchTerm ? filteredTranscript : videoData.transcript).map((item, index) => {
                const isHighlighted = searchTerm && 
                  item.word.toLowerCase().includes(searchTerm.toLowerCase());
                const isCurrent = currentWord?.word === item.word && 
                  currentWord?.start === item.start;
                
                return (
                  <span
                    key={`${item.word}-${item.start}-${index}`}
                    className={`transcript-word ${
                      isHighlighted ? 'highlighted' : ''
                    } ${isCurrent ? 'current' : ''}`}
                    onClick={() => handleWordClick(item.start)}
                    title={`Jump to ${item.start.toFixed(1)}s`}
                  >
                    {item.word}{" "}
                  </span>
                );
              })}
            </div>
          </ScrollArea>

          {searchTerm && (
            <div className="mt-4 text-sm text-muted-foreground">
              Found {filteredTranscript.length} matching word{filteredTranscript.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </Card>

      {/* Summary Section */}
      <Card className="glass">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">AI Summary</h3>
            {!summary && (
              <Button
                onClick={generateSummary}
                disabled={isGeneratingSummary}
                className="bg-gradient-primary"
              >
                {isGeneratingSummary ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            )}
          </div>

          {summary ? (
            <div className="prose prose-invert max-w-none">
              <div className="bg-video-surface/50 p-6 rounded-lg border border-primary/20">
                <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                  {summary}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Click "Generate Summary" to create an AI-powered summary of your video content
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};