import type { UserRoleId, QuestionStatusId } from './models';

export interface UserDetailsResponse {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  position: string | null;
  email: string;
  additionalInfo: string | null;
  created: string;
  updated: string | null;
}

export interface UserResponse {
  id: string;
  login: string;
  userRoleId: UserRoleId;
  userDetails: UserDetailsResponse | null;
  created: string;
  updated: string | null;
}

export type VoteType = 'Like' | 'Dislike';

export interface VoteResultResponse {
  likes: number;
  dislikes: number;
  userVote: VoteType | null;
}

export interface QuestionResponse {
  id: string;
  status: QuestionStatusId;
  text: string;
  author: string | null;
  areaTitle: string | null;
  speakerId: string | null;
  speakerName: string;
  views: number;
  likes: number;
  dislikes: number;
  userVote: VoteType | null;
  created: string;
  answered: string | null;
}

export interface FaqCategoryResponse {
  id: string;
  name: string;
  order: number;
  created: string;
  updated: string | null;
}

export interface FaqCategoryWithEntriesResponse extends FaqCategoryResponse {
  entries: FaqEntryResponse[];
}

export interface FaqEntryResponse {
  id: string;
  question: string;
  answer: string;
  order: number;
  created: string;
  updated: string | null;
}

export interface AreaResponse {
  id: string;
  title: string;
  order: number;
  created: string;
  updated: string | null;
}

export interface FeedbackResponse {
  id: string;
  username: string;
  email: string;
  theme: string;
  text: string;
  created: string;
  updated: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SpeakerResponse {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  position: string | null;
  email: string;
  additionalInfo: string | null;
  login: string;
}

export interface CreateSpeakerResponse extends SpeakerResponse {
  generatedPassword: string;
}

export interface DashboardSummaryResponse {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  averageResponseTimeHours: number;
  totalFeedback: number;
  totalAreas: number;
  questionsWithoutSpeaker: number;
  byStatus: StatusDistributionResponse[];
  timeline: TimelinePointResponse[];
  byArea: AreaDistributionResponse[];
  topSpeakers: SpeakerProductivityResponse[];
  speakerAreas: SpeakerAreaResponse[];
  votes: VotesSummaryResponse;
}

export interface StatusDistributionResponse {
  status: number;
  count: number;
}

export interface TimelinePointResponse {
  date: string;
  newCount: number;
  answeredCount: number;
}

export interface AreaDistributionResponse {
  areaTitle: string;
  count: number;
}

export interface SpeakerProductivityResponse {
  speakerId: string;
  speakerName: string;
  assignedQuestions: number;
  answeredQuestions: number;
  answerRate: number;
  averageResponseHours: number;
}

export interface SpeakerAreaResponse {
  speakerId: string;
  speakerName: string;
  areaTitle: string;
  questionCount: number;
}

export interface VotesSummaryResponse {
  totalLikes: number;
  totalDislikes: number;
}
