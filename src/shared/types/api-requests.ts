export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  password: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
}

export interface QuestionCreateRequest {
  text: string | null;
  author: string | null;
  areaId: string | null;
  speakerId: string | null;
}

export interface QuestionUpdateRequest {
  id: string;
  text: string;
  author: string | null;
  areaId: string | null;
  speakerId: string | null;
}

export interface FaqCategoryCreateRequest {
  name: string;
  order: number;
}

export interface FaqCategoryUpdateRequest {
  id: string;
  name: string;
}

export interface FaqEntryCreateRequest {
  faqCategoryId: string;
  question: string;
  answer: string;
  order: number;
}

export interface FaqEntryUpdateRequest {
  id: string;
  question: string;
  answer: string;
}

export interface AreaCreateRequest {
  title: string;
  order: number;
}

export interface AreaUpdateRequest {
  id: string;
  title: string;
}

export interface FeedbackCreateRequest {
  username: string;
  email: string;
  theme: string;
  text: string;
}

export interface SpeakerCreateRequest {
  firstName: string;
  lastName: string;
  patronymic: string | null;
  position: string | null;
  email: string;
}

export interface SpeakerUpdateRequest {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  position: string | null;
  email: string;
  additionalInfo: string | null;
}

export interface QuestionStatusChangeRequest {
  status: number;
}

export interface QuestionCommentRequest {
  comment: string | null;
}
