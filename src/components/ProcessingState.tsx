import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap, Volume2, FileText, Video } from "lucide-react";

interface ProcessingStateProps {
  progress: number;
}

export const ProcessingState = ({ progress }: ProcessingStateProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { 
      icon: Volume2, 
      title: "Extracting Audio", 
      description: "Separating audio track from video",
      threshold: 20 
    },
    { 
      icon: Zap, 
      title: "Denoising Audio", 
      description: "Cleaning up background noise",
      threshold: 40 
    },
    { 
      icon: FileText, 
      title: "Transcribing Speech", 
      description: "Converting speech to text using AI",
      threshold: 60 
    },
    { 
      icon: Video, 
      title: "Processing Video", 
      description: "Finalizing video with enhancements",
      threshold: 80 
    },
  ];

  useEffect(() => {
    const newStep = steps.findIndex(step => progress < step.threshold);
    setCurrentStep(newStep === -1 ? steps.length - 1 : Math.max(0, newStep));
  }, [progress]);

  return (
    <Card className="glass">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-2">Processing Your Video</h2>
          <p className="text-muted-foreground">
            Hang tight while we work our magic
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-primary font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = progress > step.threshold;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                    isActive 
                      ? 'bg-primary/10 border border-primary/20 scale-105' 
                      : isCompleted
                      ? 'bg-video-accent/10 border border-video-accent/20'
                      : 'bg-video-surface/50 border border-border/10'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isActive 
                      ? 'bg-primary text-primary-foreground animate-pulse' 
                      : isCompleted
                      ? 'bg-video-accent text-background'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isActive ? 'text-primary' : isCompleted ? 'text-video-accent' : 'text-foreground'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  
                  {isCompleted && !isActive && (
                    <div className="w-5 h-5 bg-video-accent rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-background rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            This usually takes 2-5 minutes depending on video length
          </div>
        </div>
      </div>
    </Card>
  );
};