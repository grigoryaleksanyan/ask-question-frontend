import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useApiCall } from '@/shared/lib/use-api-call';
import { TOAST_HANDLED } from '@/shared/lib/use-api-call';

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
    remove: vi.fn(),
  }),
}));

vi.mock('@/features/preloader', () => ({
  usePreloaderStore: () => ({
    addLoader: vi.fn(),
    removeLoader: vi.fn(),
  }),
}));

describe('useApiCall', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('успешный вызов', () => {
    it('возвращает данные при успехе', async () => {
      const apiFn = vi.fn().mockResolvedValue('result');
      const { execute, data, isLoading, error } = useApiCall(apiFn, {
        successMessage: 'Успех',
      });

      const result = await execute();

      expect(result).toBe('result');
      expect(data.value).toBe('result');
      expect(isLoading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('не показывает toast без successMessage', async () => {
      const apiFn = vi.fn().mockResolvedValue('result');
      const { execute } = useApiCall(apiFn);

      const result = await execute();

      expect(result).toBe('result');
    });
  });

  describe('ошибка', () => {
    it('возвращает undefined и сохраняет ошибку', async () => {
      const apiFn = vi
        .fn()
        .mockRejectedValue(new Error('Ошибка сервера'));
      const { execute, data, isLoading, error } = useApiCall(apiFn);

      const result = await execute();

      expect(result).toBeUndefined();
      expect(data.value).toBeNull();
      expect(isLoading.value).toBe(false);
      expect(error.value?.message).toBe('Ошибка сервера');
    });

    it('помечает ошибку Symbol toast-handled', async () => {
      const apiError = new Error('test');
      const apiFn = vi.fn().mockRejectedValue(apiError);
      const { execute } = useApiCall(apiFn);

      await execute();

      expect((apiError as Record<symbol, boolean>)[TOAST_HANDLED]).toBe(
        true,
      );
    });

    it('вызывает onError callback', async () => {
      const apiFn = vi
        .fn()
        .mockRejectedValue(new Error('err'));
      const onError = vi.fn();
      const { execute } = useApiCall(apiFn, { onError });

      await execute();

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0].message).toBe('err');
    });
  });

  describe('preloader', () => {
    it('не вызывает preloader при showPreloader: false', async () => {
      const apiFn = vi.fn().mockResolvedValue('ok');
      const { execute } = useApiCall(apiFn, {
        showPreloader: false,
      });

      await execute();

      expect(apiFn).toHaveBeenCalled();
    });
  });

  describe('onSuccess callback', () => {
    it('вызывается с данными при успехе', async () => {
      const apiFn = vi.fn().mockResolvedValue('result');
      const onSuccess = vi.fn();
      const { execute } = useApiCall(apiFn, { onSuccess });

      await execute();

      expect(onSuccess).toHaveBeenCalledWith('result');
    });
  });

  describe('isLoading', () => {
    it('true во время выполнения, false после', async () => {
      let resolveApi: (value: string) => void;
      const apiFn = vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveApi = resolve;
        }),
      );
      const { execute, isLoading } = useApiCall(apiFn);

      const promise = execute();

      expect(isLoading.value).toBe(true);

      resolveApi!('done');

      await promise;

      expect(isLoading.value).toBe(false);
    });
  });
});
