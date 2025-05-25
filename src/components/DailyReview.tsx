
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface DailyReviewProps {
  onComplete?: () => void;
}

const reviewPrompts = [
  "What was your biggest win today?",
  "Did you face any unexpected challenges?",
  "What creative ideas emerged today?",
  "What's the most important task for tomorrow?",
  "Is there anything you need to delegate?",
];

const DailyReview = ({ onComplete }: DailyReviewProps) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState<string[]>(Array(reviewPrompts.length).fill(""));

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentPrompt] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentPrompt < reviewPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reflection</CardTitle>
        <CardDescription>
          Take a moment to reflect on your day and prepare for tomorrow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{reviewPrompts[currentPrompt]}</h3>
          <Textarea 
            placeholder="Your thoughts..."
            className="min-h-[120px]"
            value={responses[currentPrompt]}
            onChange={(e) => handleResponseChange(e.target.value)}
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Question {currentPrompt + 1} of {reviewPrompts.length}</span>
            <div className="w-full max-w-[200px] bg-gray-100 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full" 
                style={{ width: `${((currentPrompt + 1) / reviewPrompts.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPrompt === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="gap-1"
        >
          {currentPrompt < reviewPrompts.length - 1 ? (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            "Complete"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyReview;
