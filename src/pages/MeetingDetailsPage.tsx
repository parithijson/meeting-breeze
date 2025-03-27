
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui-elements/GlassCard";
import { Meeting } from "@/types/meeting";

const useMeetingDetails = (meetingId: string) => {
  const storedMeetings = localStorage.getItem('meetings');
  const meetings = storedMeetings ? JSON.parse(storedMeetings) : [];
  
  const meeting = meetings.find((m: any) => m.id === meetingId);
  
  if (!meeting) return null;
  
  // Ensure we have a single recording
  if (!meeting.recording) {
    meeting.recording = {
      id: 'rec1',
      url: '#',
      name: 'Full Interview Recording',
      duration: 1850, // in seconds
      timestamp: new Date().toISOString()
    };
  }
  
  if (!meeting.candidateName) {
    meeting.candidateName = "John Doe";
  }
  
  return {
    ...meeting,
    createdAt: new Date(meeting.createdAt)
  };
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const AudioPlayer: React.FC<{ recording: Meeting['recording'] }> = ({ recording }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  
  if (!recording) return null;
  
  const progress = (currentTime / recording.duration) * 100;
  
  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 transition-all">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{recording.name}</h3>
          <span className="text-sm text-gray-600">{formatDuration(recording.duration)}</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Time indicators */}
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(recording.duration)}</span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none shadow-md hover:shadow-lg transition-all"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setCurrentTime(Math.min(recording.duration, currentTime + 10))}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

const MeetingDetailsPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const meeting = useMeetingDetails(meetingId || '');
  
  if (!meeting) {
    return (
      <div className="min-h-screen w-full py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="w-full max-w-5xl mx-auto">
          <GlassCard className="p-8 text-center">
            <h1 className="text-2xl font-semibold mb-4">Meeting Not Found</h1>
            <p className="text-muted-foreground mb-6">The meeting you're looking for does not exist.</p>
            <Button onClick={() => navigate('/meetings')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Meetings
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-12 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/meetings')}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Meetings
          </Button>
        </div>
        
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">{meeting.documentName}</h1>
              <div className="text-sm text-muted-foreground mt-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                {formatDate(meeting.createdAt)}
              </div>
            </div>
            
            <div className="text-sm text-blue-600 font-medium">
              Candidate: {meeting.candidateName}
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Interview Recording</h2>
          <AudioPlayer recording={meeting.recording} />
        </GlassCard>
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
