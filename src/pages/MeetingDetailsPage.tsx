import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Mail, 
  FileText, 
  Video, 
  ChevronLeft,
  Star,
  MessageSquare,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui-elements/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Meeting, 
  CandidateResult, 
  Recording, 
  MeetingStatus, 
  PerformanceMetric 
} from "@/types/meeting";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const useMeetingDetails = (meetingId: string) => {
  const storedMeetings = localStorage.getItem('meetings');
  const meetings = storedMeetings ? JSON.parse(storedMeetings) : [];
  
  const meeting = meetings.find((m: any) => m.id === meetingId);
  
  if (!meeting) return null;
  
  if (!meeting.results) {
    meeting.results = [
      {
        id: '1',
        questionId: 'q1',
        question: 'Tell me about your experience with React.',
        answer: 'I have been working with React for 3 years, building responsive web applications and learning best practices.',
        score: 8.5,
        feedback: 'Strong understanding of React fundamentals. Could elaborate more on specific challenges faced.',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        questionId: 'q2',
        question: 'How do you handle state management in large applications?',
        answer: 'For large applications, I prefer using Redux for global state and React Context for component trees that share state.',
        score: 7.8,
        feedback: 'Good knowledge of state management tools. Consider discussing performance optimization strategies.',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        questionId: 'q3',
        question: 'Describe your approach to testing React components.',
        answer: 'I use Jest and React Testing Library for unit and integration tests. I focus on testing behavior rather than implementation details.',
        score: 9.2,
        feedback: 'Excellent testing philosophy and practical knowledge of testing tools.',
        timestamp: new Date().toISOString()
      }
    ];
  }
  
  if (!meeting.recordings) {
    meeting.recordings = [
      {
        id: 'rec1',
        url: '#',
        name: 'Full Interview Recording',
        duration: 1850, // in seconds
        timestamp: new Date().toISOString()
      },
      {
        id: 'rec2',
        url: '#',
        name: 'Question 1 Response',
        duration: 120,
        timestamp: new Date().toISOString()
      },
      {
        id: 'rec3',
        url: '#',
        name: 'Question 2 Response',
        duration: 95,
        timestamp: new Date().toISOString()
      },
      {
        id: 'rec4',
        url: '#',
        name: 'Question 3 Response',
        duration: 180,
        timestamp: new Date().toISOString()
      }
    ];
  }
  
  if (!meeting.overallScore) {
    const totalScore = meeting.results.reduce((sum: number, result: CandidateResult) => sum + result.score, 0);
    meeting.overallScore = totalScore / meeting.results.length;
  }
  
  if (!meeting.performanceMetrics) {
    meeting.performanceMetrics = [
      {
        name: "Code Quality",
        score: 2,
        maxScore: 10,
        feedback: "The code is extremely rudimentary and completely fails to address the prompt. It initializes a Node.js environment, prints \"hi\" to the console, and does nothing related to finding the second largest number in an array. There's no logic, no algorithm, and no attempt to handle edge cases (like an array with fewer than two elements). It's essentially a placeholder."
      },
      {
        name: "Communication",
        score: 1,
        maxScore: 10,
        feedback: "The candidate provided irrelevant responses (\"yeah fine,\" \"hello\") to questions about their family and then offered a completely unhelpful and non-responsive snippet of code. There is no explanation of the intended approach, no discussion of algorithms, and no consideration of how the code would work. The candidate doesn't demonstrate even a basic understanding of the problem."
      },
      {
        name: "Consistency & Logical Flow",
        score: 0,
        maxScore: 10,
        feedback: "There is no logical flow. The responses are disjointed and random. The code snippet appears to be an afterthought with no connection to the previous questions or the problem being asked."
      }
    ];
  }
  
  if (!meeting.finalScore) {
    meeting.finalScore = meeting.performanceMetrics
      ? meeting.performanceMetrics.reduce((sum, metric) => sum + metric.score, 0)
      : 0;
  }
  
  if (!meeting.summary) {
    meeting.summary = "This candidate demonstrated a significant lack of preparation and understanding of the interview. Their initial responses were unhelpful and the code provided was completely irrelevant. They showed no ability to apply their technical knowledge to a given problem and lack the communication skills to explain their thought process. This response suggests a very low level of competency in both programming and interview etiquette. There's a need for substantial improvement in both areas.";
  }
  
  if (!meeting.candidateName) {
    meeting.candidateName = "John Doe";
  }
  
  if (!meeting.candidateEmail) {
    meeting.candidateEmail = "john.doe@example.com";
  }
  
  return {
    ...meeting,
    createdAt: new Date(meeting.createdAt)
  };
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

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
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

const getScoreColor = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 70) return "text-green-600";
  if (percentage >= 40) return "text-yellow-600";
  return "text-red-600";
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
  
  const scoreColor = meeting.overallScore >= 8 
    ? "text-green-600" 
    : meeting.overallScore >= 6 
      ? "text-yellow-600" 
      : "text-red-600";
  
  const finalScorePercentage = meeting.finalScore ? (meeting.finalScore / (meeting.performanceMetrics?.length || 1) / 10) * 100 : 0;
  const finalScoreColor = finalScorePercentage >= 70 
    ? "text-green-600" 
    : finalScorePercentage >= 40 
      ? "text-yellow-600" 
      : "text-red-600";

  return (
    <div className="min-h-screen w-full py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
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
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={meeting.status} />
                <span className="text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {formatDate(meeting.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold flex items-center gap-1">
                <span className={finalScoreColor}>{meeting.finalScore || 0}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <span className="text-sm text-muted-foreground">Final Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Candidate</h3>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{meeting.candidateName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{meeting.candidateEmail}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Meeting Details</h3>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>Document: {meeting.documentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-muted-foreground" />
                <span className="truncate max-w-[250px]">Link: {meeting.link}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium">AI Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {meeting.summary}
            </p>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Performance Evaluation</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {meeting.performanceMetrics?.map((metric, index) => (
              <AccordionItem key={index} value={`metric-${index}`}>
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="flex justify-between w-full pr-4">
                    <span>{metric.name}</span>
                    <span className={getScoreColor(metric.score, metric.maxScore)}>
                      {metric.score}/{metric.maxScore}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Alert className="mb-4">
                    <AlertTitle>Feedback</AlertTitle>
                    <AlertDescription>
                      {metric.feedback}
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="font-semibold">Final Score:</span>
            <span className={`font-bold text-lg ${finalScoreColor}`}>
              {meeting.finalScore || 0}/100
            </span>
          </div>
        </GlassCard>
        
        <Tabs defaultValue="results">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="results" className="flex-1">Results</TabsTrigger>
            <TabsTrigger value="recordings" className="flex-1">Recordings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="space-y-6 mt-6">
            {meeting.results?.map((result: CandidateResult) => (
              <GlassCard key={result.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">{result.question}</h3>
                  <Badge variant="outline" className={`${result.score >= 8 ? 'bg-green-100 border-green-300 text-green-800' : result.score >= 6 ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
                    Score: {result.score.toFixed(1)}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Answer:</h4>
                  <p className="text-sm p-3 bg-gray-50 rounded-md">{result.answer}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Feedback:</h4>
                  <p className="text-sm p-3 bg-blue-50 rounded-md">{result.feedback}</p>
                </div>
              </GlassCard>
            ))}
          </TabsContent>
          
          <TabsContent value="recordings" className="mt-6">
            <GlassCard className="p-0 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {meeting.recordings?.map((recording: Recording) => (
                  <div key={recording.id} className="p-4 border-b border-r">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video className="w-5 h-5 text-muted-foreground mr-3" />
                        <div>
                          <h3 className="font-medium">{recording.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDuration(recording.duration)}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-2">Play</Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
