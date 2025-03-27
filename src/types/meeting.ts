
export type MeetingStatus = 'waiting' | 'active' | 'stopped';

export interface CandidateResult {
  id: string;
  questionId: string;
  question: string;
  answer: string;
  score: number;
  feedback: string;
  timestamp: string;
}

export interface Recording {
  id: string;
  url: string;
  name: string;
  duration: number;
  timestamp: string;
}

export interface PerformanceMetric {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface Meeting {
  id: string;
  title?: string;
  link: string;
  documentName: string;
  status: MeetingStatus;
  createdAt: Date;
  candidateName?: string;
  candidateEmail?: string;
  results?: CandidateResult[];
  recordings?: Recording[];
  overallScore?: number;
  finalScore?: number;
  summary?: string;
  performanceMetrics?: PerformanceMetric[];
}
