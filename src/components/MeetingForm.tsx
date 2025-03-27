
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BreathingButton from "./ui-elements/BreathingButton";
import GlassCard from "./ui-elements/GlassCard";
import { toast } from "sonner";

interface MeetingFormProps {
  pdfUploaded: boolean;
  pdfFile: File | null;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ pdfUploaded, pdfFile }) => {
  const [meetingLink, setMeetingLink] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleStartMeeting = () => {
    if (!meetingLink) {
      toast.error("Please enter a meeting link");
      return;
    }

    if (!pdfUploaded || !pdfFile) {
      toast.error("Please upload a PDF document first");
      return;
    }

    setIsProcessing(true);

    // Create a new meeting
    const newMeeting = {
      id: Date.now().toString(),
      link: meetingLink,
      documentName: pdfFile.name,
      status: 'waiting',
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    const existingMeetings = localStorage.getItem('meetings');
    const meetings = existingMeetings ? JSON.parse(existingMeetings) : [];
    meetings.push(newMeeting);
    localStorage.setItem('meetings', JSON.stringify(meetings));

    // Simulate processing
    setTimeout(() => {
      toast.success("Meeting created successfully");
      setIsProcessing(false);
      navigate('/meetings');
    }, 2000);
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
