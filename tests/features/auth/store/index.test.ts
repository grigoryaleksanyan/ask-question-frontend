import { useAuthStore } from '@/features/auth';

describe('useAuthStore', () => {
  describe('начальное состояние', () => {
    it('isAuthorized = false', () => {
      const store = useAuthStore();

      expect(store.isAuthorized).toBe(false);
    });

    it('userData = null', () => {
      const store = useAuthStore();

      expect(store.userData).toBeNull();
    });
  });

  describe('setAuthData', () => {
    it('устанавливает userData', () => {
      const store = useAuthStore();
      const user = {
        id: '1',
        login: 'admin',
        userRoleId: 1,
        created: '',
        updated: null,
        userDetails: null,
      } as any;

      store.setAuthData(user);

      expect(store.userData).toEqual(user);
    });

    it('isAuthorized = true', () => {
      const store = useAuthStore();

      store.setAuthData({
        id: '1',
        login: 'admin',
        userRoleId: 1,
        created: '',
        updated: null,
        userDetails: null,
      } as any);

      expect(store.isAuthorized).toBe(true);
    });
  });

  describe('removeAuthData', () => {
    it('сбрасывает userData в null', () => {
      const store = useAuthStore();

      store.setAuthData({
        id: '1',
        login: 'admin',
        userRoleId: 1,
        created: '',
        updated: null,
        userDetails: null,
      } as any);
      store.removeAuthData();

      expect(store.userData).toBeNull();
    });

    it('isAuthorized = false', () => {
      const store = useAuthStore();

      store.setAuthData({
        id: '1',
        login: 'admin',
        userRoleId: 1,
        created: '',
        updated: null,
        userDetails: null,
      } as any);
      store.removeAuthData();

      expect(store.isAuthorized).toBe(false);
    });
  });

  describe('computed', () => {
    it('getAuthStatus возвращает isAuthorized', () => {
      const store = useAuthStore();

      expect(store.getAuthStatus).toBe(false);

      store.setAuthData({
        id: '1',
        login: 'admin',
        userRoleId: 1,
        created: '',
        updated: null,
        userDetails: null,
      } as any);

      expect(store.getAuthStatus).toBe(true);
    });

    it('getUserData возвращает userData', () => {
      const store = useAuthStore();
      const user = {
        id: '1',
        login: 'admin',
        userRoleId: 1,
        created: '',
        updated: null,
        userDetails: null,
      } as any;

      expect(store.getUserData).toBeNull();

      store.setAuthData(user);

      expect(store.getUserData).toEqual(user);
    });
  });
});
