import { useAlertStore } from '@/entities/alert';

describe('useAlertStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('начальное состояние', () => {
    it('alerts = []', () => {
      const store = useAlertStore();

      expect(store.alerts).toEqual([]);
    });

    it('getAlerts = []', () => {
      const store = useAlertStore();

      expect(store.getAlerts).toEqual([]);
    });
  });

  describe('addAlert', () => {
    it('добавляет alert в массив', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Успех' });

      expect(store.alerts).toHaveLength(1);
      expect(store.alerts[0].type).toBe('success');
      expect(store.alerts[0].text).toBe('Успех');
    });

    it('авто-удаление через delay мс (type !== error)', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Успех', delay: 5000 });

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(4999);

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(1);

      expect(store.alerts).toHaveLength(0);
    });

    it('авто-удаление через 3000 мс по умолчанию (delay не указан)', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'info', text: 'Инфо' });

      vi.advanceTimersByTime(2999);

      expect(store.alerts).toHaveLength(1);

      vi.advanceTimersByTime(1);

      expect(store.alerts).toHaveLength(0);
    });

    it('не удаляет error-алерт автоматически', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'error', text: 'Ошибка', delay: 1000 });

      vi.advanceTimersByTime(10000);

      expect(store.alerts).toHaveLength(1);
    });
  });

  describe('removeAlert', () => {
    it('удаляет alert по id', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Первый' });
      store.addAlert({ type: 'info', text: 'Второй' });

      const id = store.alerts[0].id;

      store.removeAlert(id);

      expect(store.alerts).toHaveLength(1);
      expect(store.alerts[0].text).toBe('Второй');
    });

    it('не падает при несуществующем id', () => {
      const store = useAlertStore();

      store.addAlert({ type: 'success', text: 'Тест' });

      store.removeAlert('nonexistent-id');

      expect(store.alerts).toHaveLength(1);
    });
  });
});
