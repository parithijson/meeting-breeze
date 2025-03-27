import React from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "./ui-elements/GlassCard";
import { Button } from "./ui/button";
import { Meeting, MeetingStatus } from "@/types/meeting";
import { 
  Calendar, 
  Play,
  Square,
  Loader,
  Video
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "sonner";

const useMeetings = () => {
  const storedMeetings = localStorage.getItem('meetings');
  const meetings = storedMeetings ? JSON.parse(storedMeetings) : [];
  
  return meetings.map((meeting: any) => ({
    ...meeting,
    createdAt: new Date(meeting.createdAt)
  }));
};

const StatusBadge: React.FC<{ status: MeetingStatus }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 border-green-300";
      case 'stopped':
        return "bg-red-100 text-red-800 border-red-300";
      case 'waiting':
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'stopped':
        return <Square className="w-4 h-4" />;
      case 'waiting':
        return <Loader className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {getStatusIcon()}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MeetingsList: React.FC = () => {
  const meetings = useMeetings();
  const navigate = useNavigate();

  const handleMeetingAction = (meetingId: string, action: 'start' | 'stop') => {
    const storedMeetings = localStorage.getItem('meetings');
    const meetings = storedMeetings ? JSON.parse(storedMeetings) : [];
    
    const updatedMeetings = meetings.map((meeting: any) => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          status: action === 'start' ? 'active' : 'stopped'
        };
      }
      return meeting;
    });
    
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
    
    toast.success(`Meeting ${action === 'start' ? 'started' : 'stopped'} successfully`);
    
    window.location.reload();
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

  const navigateToMeetingDetails = (meetingId: string) => {
    navigate(`/meetings/${meetingId}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8">
      <GlassCard className="p-8 text-center animate-slide-down">
        <h1 className="text-3xl font-semibold mb-2">Meetings</h1>
        <p className="text-muted-foreground">View and manage your meetings</p>
      </GlassCard>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Your Meetings</h2>
          <p className="text-muted-foreground text-sm">
            {meetings.length} total meetings
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <Video size={16} />
          New Meeting
        </Button>
      </div>

      <GlassCard className="p-0 overflow-hidden animate-fade-in">
        {meetings.length > 0 ? (
          <Table>
            <TableCaption>A list of your recent meetings.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Meeting Link</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting: Meeting) => (
                <TableRow 
                  key={meeting.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigateToMeetingDetails(meeting.id)}
                >
                  <TableCell className="font-medium">{meeting.documentName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{meeting.link}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(new Date(meeting.createdAt))}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={meeting.status} />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    {meeting.status === 'waiting' || meeting.status === 'stopped' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMeetingAction(meeting.id, 'start')}
                        className="mr-2"
                      >
                        <Play className="w-4 h-4 mr-1" /> Start
                      </Button>
                    ) : null}
                    
                    {meeting.status === 'active' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMeetingAction(meeting.id, 'stop')}
                      >
                        <Square className="w-4 h-4 mr-1" /> Stop
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Video className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No meetings yet</h3>
            <p className="text-muted-foreground">
              Start a new meeting from the dashboard to see it here.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default MeetingsList;
