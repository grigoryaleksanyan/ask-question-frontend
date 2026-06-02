import { QuestionStatusId } from '@/shared/types';

import type { QuestionStatus } from '@/shared/types';

const QUESTION_STATUSES: Record<string, QuestionStatus> = {
  NEW: {
    STATUS_ID: QuestionStatusId.New,
    TITLE: 'новый',
    COLOR: '#6B7CF6',
  },
  IN_FOCUS: {
    STATUS_ID: QuestionStatusId.InFocus,
    TITLE: 'в фокусе',
    COLOR: '#2AA89A',
  },
  ANSWERED: {
    STATUS_ID: QuestionStatusId.Answered,
    TITLE: 'отвеченный',
    COLOR: '#45BF8A',
  },
};

export const questionStatusMap: Record<
  QuestionStatusId,
  { color: string; label: string }
> = {
  [QuestionStatusId.New]: {
    color: QUESTION_STATUSES.NEW.COLOR,
    label: QUESTION_STATUSES.NEW.TITLE,
  },
  [QuestionStatusId.InFocus]: {
    color: QUESTION_STATUSES.IN_FOCUS.COLOR,
    label: QUESTION_STATUSES.IN_FOCUS.TITLE,
  },
  [QuestionStatusId.Answered]: {
    color: QUESTION_STATUSES.ANSWERED.COLOR,
    label: QUESTION_STATUSES.ANSWERED.TITLE,
  },
};

export function getStatusColor(status: QuestionStatusId): string {
  return questionStatusMap[status]?.color ?? QUESTION_STATUSES.ANSWERED.COLOR;
}

export function getStatusLabel(status: QuestionStatusId): string {
  return questionStatusMap[status]?.label ?? '';
}

export default QUESTION_STATUSES;
