import { usePreloaderStore } from '@/features/preloader';

describe('usePreloaderStore', () => {
  describe('начальное состояние', () => {
    it('loadings = 0', () => {
      const store = usePreloaderStore();

      expect(store.loadings).toBe(0);
    });

    it('showPreloader = false', () => {
      const store = usePreloaderStore();

      expect(store.showPreloader).toBe(false);
    });
  });

  describe('addLoader', () => {
    it('инкрементит loadings', () => {
      const store = usePreloaderStore();

      store.addLoader();

      expect(store.loadings).toBe(1);
    });

    it('showPreloader = true при loadings > 0', () => {
      const store = usePreloaderStore();

      store.addLoader();

      expect(store.showPreloader).toBe(true);
    });
  });

  describe('removeLoader', () => {
    it('декрементит loadings при loadings > 0', () => {
      const store = usePreloaderStore();

      store.addLoader();
      store.addLoader();
      store.removeLoader();

      expect(store.loadings).toBe(1);
    });

    it('не уходит в минус при loadings = 0', () => {
      const store = usePreloaderStore();

      store.removeLoader();

      expect(store.loadings).toBe(0);
    });
  });
});
