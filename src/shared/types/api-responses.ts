import type { UserRoleId, QuestionStatusId } from './models';

export interface UserDetailsResponse {
  id: string;
  fullName: string;
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

export interface QuestionResponse {
  id: string;
  status: QuestionStatusId;
  text: string;
  author: string | null;
  area: string | null;
  speaker: string;
  views: number;
  likes: number;
  dislikes: number;
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

export interface CaptchaResponse {
  id: string;
  captchaImage: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SpeakerResponse {
  id: string;
  fullName: string;
}
