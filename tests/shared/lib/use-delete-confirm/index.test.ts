import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteConfirm } from '@/shared/lib/use-delete-confirm';

// Mock useApiCall
vi.mock('@/shared/lib/use-api-call', () => ({
  useApiCall: vi.fn(),
}));

import { useApiCall } from '@/shared/lib/use-api-call';

describe('useDeleteConfirm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns confirm function that calls apiFn and returns true on success', async () => {
    const mockExecute = vi.fn().mockResolvedValue('deleted');
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: { value: false },
      error: { value: null },
    });

    const apiFn = vi.fn().mockResolvedValue('result');
    const { confirm } = useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
    });

    const result = await confirm('123');

    expect(mockExecute).toHaveBeenCalledWith('123');
    expect(result).toBe(true);
  });

  it('returns false when apiFn fails', async () => {
    const mockExecute = vi.fn().mockResolvedValue(undefined);
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: { value: false },
      error: { value: null },
    });

    const apiFn = vi.fn();
    const { confirm } = useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
    });

    const result = await confirm('123');

    expect(result).toBe(false);
  });

  it('uses showPreloader=false by default', () => {
    const mockExecute = vi.fn();
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: { value: false },
      error: { value: null },
    });

    const apiFn = vi.fn();
    useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
    });

    expect(useApiCall).toHaveBeenCalledWith(
      apiFn,
      expect.objectContaining({
        showPreloader: false,
      }),
    );
  });

  it('accepts custom showPreloader value', () => {
    const mockExecute = vi.fn();
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: { value: false },
      error: { value: null },
    });

    const apiFn = vi.fn();
    useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
      showPreloader: true,
    });

    expect(useApiCall).toHaveBeenCalledWith(
      apiFn,
      expect.objectContaining({
        showPreloader: true,
      }),
    );
  });

  it('returns isLoading and error refs', () => {
    const mockExecute = vi.fn();
    const mockIsLoading = { value: false };
    const mockError = { value: null };
    (useApiCall as unknown as vi.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: mockIsLoading,
      error: mockError,
    });

    const apiFn = vi.fn();
    const { isLoading, error } = useDeleteConfirm({
      apiFn,
      successMessage: 'Deleted',
    });

    expect(isLoading).toBe(mockIsLoading);
    expect(error).toBe(mockError);
  });
});