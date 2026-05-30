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
  WITH_COMMENT: {
    STATUS_ID: QuestionStatusId.WithComment,
    TITLE: 'с комментарием',
    COLOR: '#E5A44F',
  },
  ANSWERED: {
    STATUS_ID: QuestionStatusId.Answered,
    TITLE: 'отвеченный',
    COLOR: '#45BF8A',
  },
};

export default QUESTION_STATUSES;
