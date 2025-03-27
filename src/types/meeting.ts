
export type MeetingStatus = 'waiting' | 'active' | 'stopped';

export interface Meeting {
  id: string;
  title?: string;
  link: string;
  documentName: string;
  status: MeetingStatus;
  createdAt: Date;
}
