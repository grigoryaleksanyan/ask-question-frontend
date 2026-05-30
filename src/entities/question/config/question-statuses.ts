import { QuestionStatusId } from '@/shared/types';

import type { QuestionStatus } from '@/shared/types';

const QUESTION_STATUSES: Record<string, QuestionStatus> = {
  NEW: {
    STATUS_ID: QuestionStatusId.New,
    TITLE: 'новый',
    COLOR: '#5c6bc0',
  },
  IN_FOCUS: {
    STATUS_ID: QuestionStatusId.InFocus,
    TITLE: 'в фокусе',
    COLOR: '#26a69a',
  },
  WITH_COMMENT: {
    STATUS_ID: QuestionStatusId.WithComment,
    TITLE: 'с комментарием',
    COLOR: '#ffb74d',
  },
  ANSWERED: {
    STATUS_ID: QuestionStatusId.Answered,
    TITLE: 'отвеченный',
    COLOR: '#4ecca3',
  },
};

export default QUESTION_STATUSES;
