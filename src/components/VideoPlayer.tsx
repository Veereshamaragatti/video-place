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
    <div className="flex gap-6 h-[80vh]">
      {/* Video Player */}
      <div className="flex-1">
        <Card className="glass overflow-hidden h-full">
          <div className="relative h-full">
            <video
              ref={videoRef}
              src={videoData.url}
              controls
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full bg-black object-contain"
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
      </div>

      {/* Transcript Sidebar */}
      <div className="w-96">
        <Card className="glass h-full bg-black/80 border-primary/20">
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Transcript</h3>
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Search in video"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="space-y-3 pr-4">
                {(searchTerm ? filteredTranscript : videoData.transcript).map((item, index) => {
                  const isHighlighted = searchTerm && 
                    item.word.toLowerCase().includes(searchTerm.toLowerCase());
                  const isCurrent = currentWord?.word === item.word && 
                    currentWord?.start === item.start;
                  
                  const minutes = Math.floor(item.start / 60);
                  const seconds = Math.floor(item.start % 60);
                  const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                  
                  return (
                    <div
                      key={`${item.word}-${item.start}-${index}`}
                      className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${
                        isCurrent ? 'bg-primary/20 border-l-2 border-primary' : 'hover:bg-white/5'
                      }`}
                      onClick={() => handleWordClick(item.start)}
                    >
                      <span className="text-blue-400 text-sm font-mono min-w-[40px]">
                        {timestamp}
                      </span>
                      <span className={`text-white/90 text-sm leading-relaxed ${
                        isHighlighted ? 'bg-yellow-400/30 px-1 rounded' : ''
                      }`}>
                        {item.word}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {searchTerm && (
              <div className="mt-2 text-xs text-white/60 border-t border-white/10 pt-2">
                {filteredTranscript.length} result{filteredTranscript.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};