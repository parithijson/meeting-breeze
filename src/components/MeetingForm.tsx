
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BreathingButton from "./ui-elements/BreathingButton";
import GlassCard from "./ui-elements/GlassCard";
import { toast } from "@/components/ui/sonner";

interface MeetingFormProps {
  pdfUploaded: boolean;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ pdfUploaded }) => {
  const [meetingLink, setMeetingLink] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartMeeting = () => {
    if (!meetingLink) {
      toast.error("Please enter a meeting link");
      return;
    }

    if (!pdfUploaded) {
      toast.error("Please upload a PDF document first");
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      toast.success("Meeting started successfully");
      // In a real app, you would navigate to the meeting page or open a new window
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <GlassCard className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meeting-link" className="text-base">Meeting Link</Label>
        <Input
          id="meeting-link"
          placeholder="https://meet.example.com/meeting-id"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          className="glass-input text-base"
        />
      </div>

      <div className="pt-4 flex justify-center">
        <BreathingButton 
          onClick={handleStartMeeting}
          isBreathing={!isProcessing}
          disabled={isProcessing}
          className="px-8 py-6 text-lg font-medium"
        >
          {isProcessing ? "Processing..." : "Start Meeting"}
        </BreathingButton>
      </div>
    </GlassCard>
  );
};

export default MeetingForm;
