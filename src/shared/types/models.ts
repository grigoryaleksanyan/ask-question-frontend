export enum UserRoleId {
  Administrator = 1,
  Speaker = 2,
}

export enum QuestionStatusId {
  New = 0,
  InFocus = 1,
  Answered = 2,
}

export interface QuestionStatus {
  STATUS_ID: QuestionStatusId;
  TITLE: string;
  COLOR: string;
}

export interface NavItem {
  title: string;
  icon: string;
  link: string;
}

export interface ModalResult {
  status: boolean;
  data?: unknown;
}

export interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
}
