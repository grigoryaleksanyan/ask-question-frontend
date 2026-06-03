import { vi } from 'vitest';

import checkAuth from '@/app/router/middleware/auth-middleware';
import { useAuthStore } from '@/features/auth';

vi.mock('@/entities/user', () => ({
  GetUserData: vi.fn(),
}));

import { GetUserData } from '@/entities/user';

function createMockRoute(fullPath: string) {
  return { fullPath, meta: {} } as any;
}

describe('checkAuth', () => {
  it('возвращает true если пользователь авторизован', async () => {
    const authStore = useAuthStore();
    authStore.setAuthData({
      id: '1',
      email: 'admin@askquestion.local',
      userRoleId: 1,
      created: '',
      updated: null,
      userDetails: null,
    } as any);

    const result = await checkAuth(createMockRoute('/admin'));

    expect(result).toBe(true);
  });

  it('вызывает GetUserData и возвращает true если не авторизован', async () => {
    const mockUser = {
      id: '1',
      email: 'admin@askquestion.local',
      userRoleId: 1,
      created: '',
      updated: null,
      userDetails: null,
    };
    vi.mocked(GetUserData).mockResolvedValue(mockUser as any);

    const result = await checkAuth(createMockRoute('/admin'));

    expect(result).toBe(true);
    const authStore = useAuthStore();
    expect(authStore.getAuthStatus).toBe(true);
  });

  it('редиректит на /login с redirect query при ошибке GetUserData', async () => {
    vi.mocked(GetUserData).mockRejectedValue(new Error('Unauthorized'));

    const result = await checkAuth(createMockRoute('/admin-questions'));

    expect(result).toEqual({
      name: 'login',
      query: { redirect: '/admin-questions' },
    });
  });

  it('редиректит на /login без потери fullPath', async () => {
    vi.mocked(GetUserData).mockRejectedValue(new Error('Unauthorized'));

    const result = await checkAuth(createMockRoute('/admin-faq/42'));

    expect(result).toEqual({
      name: 'login',
      query: { redirect: '/admin-faq/42' },
    });
  });
});
