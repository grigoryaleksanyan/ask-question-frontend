import { QuestionStatusId } from '@/shared/types';

import type { QuestionStatus } from '@/shared/types';

const QUESTION_STATUSES: Record<string, QuestionStatus> = {
  NEW: {
    STATUS_ID: QuestionStatusId.New,
    TITLE: 'новый',
    COLOR: '#1976d2',
  },
  IN_FOCUS: {
    STATUS_ID: QuestionStatusId.InFocus,
    TITLE: 'в фокусе',
    COLOR: '#ff9800',
  },
  WITH_COMMENT: {
    STATUS_ID: QuestionStatusId.WithComment,
    TITLE: 'с комментарием',
    COLOR: '#428f4e',
  },
  ANSWERED: {
    STATUS_ID: QuestionStatusId.Answered,
    TITLE: 'отвеченный',
    COLOR: '#9FB980',
  },
};

export default QUESTION_STATUSES;
