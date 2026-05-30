import type { Ref } from 'vue';

export interface UseApiCallOptions<T> {
  successMessage?: string;
  errorMapper?: (error: Error) => string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showPreloader?: boolean;
}

export interface UseApiCallReturn<T, A extends unknown[] = unknown[]> {
  execute: (...args: A) => Promise<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  data: Ref<T | null>;
}
