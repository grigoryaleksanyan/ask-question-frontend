import type { AlertType } from '@/shared/types';

const ALERT_TYPES: Record<string, AlertType> = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export default ALERT_TYPES;
