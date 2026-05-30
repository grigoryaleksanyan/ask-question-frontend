import { ref, type Ref } from 'vue';

import { useToast } from 'primevue/usetoast';

import { usePreloaderStore } from '@/features/preloader';

import type { UseApiCallOptions, UseApiCallReturn } from './types';

const TOAST_HANDLED = Symbol.for('toast-handled');

export { TOAST_HANDLED };

export function useApiCall<T, A extends unknown[] = unknown[]>(
  apiFn: (...args: A) => Promise<T>,
  options: UseApiCallOptions<T> = {},
): UseApiCallReturn<T, A> {
  const toast = useToast();
  const preloaderStore = usePreloaderStore();

  const isLoading = ref(false) as Ref<boolean>;
  const error = ref(null) as Ref<Error | null>;
  const data = ref(null) as Ref<T | null>;

  const {
    successMessage,
    errorMapper,
    onSuccess,
    onError,
    showPreloader = true,
  } = options;

  async function execute(...args: A): Promise<T | undefined> {
    isLoading.value = true;
    error.value = null;

    if (showPreloader) {
      preloaderStore.addLoader();
    }

    try {
      const result = await apiFn(...args);

      data.value = result;

      if (successMessage) {
        toast.add({
          severity: 'success',
          detail: successMessage,
          group: 'api',
          life: 3000,
        });
      }

      onSuccess?.(result);

      return result;
    } catch (error_: unknown) {
      const errorObj = error_ as Error;

      error.value = errorObj;

      const errorText = errorMapper ? errorMapper(errorObj) : errorObj.message;

      toast.add({
        severity: 'error',
        detail: errorText,
        group: 'api',
        life: undefined,
      });

      (error_ as Record<symbol, boolean>)[TOAST_HANDLED] = true;

      onError?.(errorObj);

      return undefined;
    } finally {
      if (showPreloader) {
        preloaderStore.removeLoader();
      }

      isLoading.value = false;
    }
  }

  return { execute, isLoading, error, data };
}
