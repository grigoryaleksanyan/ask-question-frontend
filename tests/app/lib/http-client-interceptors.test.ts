import axios from 'axios';
import { vi } from 'vitest';

const { mockPush } = vi.hoisted(() => ({
  mockPush: vi.fn(),
}));

vi.mock('@/app/router', () => ({
  default: {
    push: mockPush,
    currentRoute: { value: { fullPath: '/admin' } },
  },
}));

vi.mock('@/shared/api', () => {
  const mockAxios = axios.create();
  return { default: mockAxios };
});

import setupHttpClientInterceptors from '@/app/lib/http-client-interceptors';
import httpClient from '@/shared/api';

describe('http-client-interceptors', () => {
  beforeEach(() => {
    mockPush.mockClear();
    setupHttpClientInterceptors();
  });

  it('при 401 вызывает router.push с redirect query', async () => {
    const error = { response: { status: 401 } };

    const handler = httpClient.interceptors.response.handlers[0];

    try {
      await handler.rejected(error);
    } catch {
      // expected rejection
    }

    expect(mockPush).toHaveBeenCalledWith({
      name: 'login',
      query: { redirect: '/admin' },
    });
  });

  it('при не-401 ошибке не вызывает router.push', async () => {
    const error = {
      response: { status: 500, data: { message: 'Server error' } },
      message: 'Server error',
    };

    const handler = httpClient.interceptors.response.handlers[0];

    try {
      await handler.rejected(error);
    } catch {
      // expected rejection
    }

    expect(mockPush).not.toHaveBeenCalled();
  });
});
