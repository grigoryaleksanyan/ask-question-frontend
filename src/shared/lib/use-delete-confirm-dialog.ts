import { useConfirm } from 'primevue/useconfirm';

import { useApiCall } from './use-api-call';

interface UseDeleteConfirmDialogOptions {
  apiFn: (id: string) => Promise<unknown>;
  message: string;
  header: string;
  successMessage: string;
}

export function useDeleteConfirmDialog({
  apiFn,
  message,
  header,
  successMessage,
}: UseDeleteConfirmDialogOptions) {
  const confirm = useConfirm();
  const { execute, error } = useApiCall(apiFn, {
    successMessage,
    showPreloader: false,
  });

  return {
    confirmDelete(id: string): Promise<boolean> {
      return new Promise((resolve) => {
        confirm.require({
          message,
          header,
          icon: 'pi pi-exclamation-triangle',
          acceptProps: {
            label: 'Удалить',
            severity: 'danger',
          },
          rejectProps: {
            label: 'Отмена',
            severity: 'secondary',
            outlined: true,
          },
          accept: async () => {
            await execute(id);
            resolve(error.value === null);
          },
          reject: () => {
            resolve(false);
          },
        });
      });
    },
  };
}
