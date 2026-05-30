import { type Ref } from 'vue';
import { useApiCall } from '../use-api-call';

interface UseDeleteConfirmOptions<T = unknown> {
  apiFn: (id: string) => Promise<T>;
  successMessage: string;
  showPreloader?: boolean;
}

interface UseDeleteConfirmReturn {
  confirm: (id: string) => Promise<boolean>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
}

export function useDeleteConfirm<T = unknown>({
  apiFn,
  successMessage,
  showPreloader = false,
}: UseDeleteConfirmOptions<T>): UseDeleteConfirmReturn {
  const { execute, isLoading, error } = useApiCall(apiFn, {
    successMessage,
    showPreloader,
  });

  async function confirm(id: string): Promise<boolean> {
    const result = await execute(id);
    return result !== undefined;
  }

  return { confirm, isLoading, error };
}
