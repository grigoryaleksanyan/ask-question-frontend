export enum UserRoleId {
  Administrator = 1,
  Speaker = 2,
}

export enum QuestionStatusId {
  New = 0,
  InFocus = 1,
  WithComment = 2,
  Answered = 3,
}

export interface QuestionStatus {
  STATUS_ID: QuestionStatusId;
  TITLE: string;
  COLOR: string;
}

export interface AlertItem {
  id: string;
  type: AlertType;
  text: string;
}

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface NavItem {
  title: string;
  icon: string;
  link: string;
}

export interface SidebarModalResult {
  status: boolean;
  data: unknown;
}

export interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
}
