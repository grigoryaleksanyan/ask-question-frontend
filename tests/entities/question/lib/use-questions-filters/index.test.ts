import { ref } from 'vue';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { QuestionStatusId } from '@/shared/dto';

const mockRoute = ref<{ query: Record<string, string> }>({ query: {} });
const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute.value,
  useRouter: () => ({ push: mockPush }),
}));

import { useQuestionsFilters } from '@/entities/question/lib/use-questions-filters';

describe('useQuestionsFilters', () => {
  beforeEach(() => {
    mockRoute.value = { query: {} };
    mockPush.mockClear();
  });

  describe('чтение из URL — дефолты', () => {
    it('возвращает дефолтный status "new" при пустом query', () => {
      const { status } = useQuestionsFilters();
      expect(status.value).toBe('new');
    });

    it('возвращает дефолтный page 1 при пустом query', () => {
      const { page } = useQuestionsFilters();
      expect(page.value).toBe(1);
    });

    it('возвращает дефолтный sortOrder "desc" при пустом query', () => {
      const { sortOrder } = useQuestionsFilters();
      expect(sortOrder.value).toBe('desc');
    });

    it('возвращает null для speakerId при пустом query', () => {
      const { speakerId } = useQuestionsFilters();
      expect(speakerId.value).toBeNull();
    });

    it('возвращает null для areaId при пустом query', () => {
      const { areaId } = useQuestionsFilters();
      expect(areaId.value).toBeNull();
    });

    it('возвращает пустую строку для search при пустом query', () => {
      const { search } = useQuestionsFilters();
      expect(search.value).toBe('');
    });
  });

  describe('чтение из URL — заданные значения', () => {
    it('читает status из query', () => {
      mockRoute.value = { query: { status: 'answered' } };
      const { status } = useQuestionsFilters();
      expect(status.value).toBe('answered');
    });

    it('читает page из query', () => {
      mockRoute.value = { query: { page: '3' } };
      const { page } = useQuestionsFilters();
      expect(page.value).toBe(3);
    });

    it('читает sortOrder из query', () => {
      mockRoute.value = { query: { sortOrder: 'asc' } };
      const { sortOrder } = useQuestionsFilters();
      expect(sortOrder.value).toBe('asc');
    });

    it('читает speakerId из query', () => {
      mockRoute.value = { query: { speakerId: 'abc123' } };
      const { speakerId } = useQuestionsFilters();
      expect(speakerId.value).toBe('abc123');
    });

    it('читает areaId из query', () => {
      mockRoute.value = { query: { areaId: 'def456' } };
      const { areaId } = useQuestionsFilters();
      expect(areaId.value).toBe('def456');
    });

    it('читает search из query', () => {
      mockRoute.value = { query: { search: 'микросервисы' } };
      const { search } = useQuestionsFilters();
      expect(search.value).toBe('микросервисы');
    });
  });

  describe('валидация невалидных значений', () => {
    it('невалидный status подставляет дефолт "new"', () => {
      mockRoute.value = { query: { status: 'invalid' } };
      const { status } = useQuestionsFilters();
      expect(status.value).toBe('new');
    });

    it('невалидный page (не число) подставляет дефолт 1', () => {
      mockRoute.value = { query: { page: 'abc' } };
      const { page } = useQuestionsFilters();
      expect(page.value).toBe(1);
    });

    it('отрицательный page подставляет дефолт 1', () => {
      mockRoute.value = { query: { page: '-1' } };
      const { page } = useQuestionsFilters();
      expect(page.value).toBe(1);
    });

    it('невалидный sortOrder подставляет дефолт "desc"', () => {
      mockRoute.value = { query: { sortOrder: 'random' } };
      const { sortOrder } = useQuestionsFilters();
      expect(sortOrder.value).toBe('desc');
    });

    it('пустой speakerId возвращает null', () => {
      mockRoute.value = { query: { speakerId: '' } };
      const { speakerId } = useQuestionsFilters();
      expect(speakerId.value).toBeNull();
    });
  });

  describe('apiParams — маппинг в QuestionListParams', () => {
    it('маппит дефолтные значения', () => {
      const { apiParams } = useQuestionsFilters();
      expect(apiParams.value).toEqual({
        page: 1,
        pageSize: 10,
        status: QuestionStatusId.New,
        speakerId: undefined,
        areaId: undefined,
        search: undefined,
        sortOrder: 'desc',
      });
    });

    it('маппит заданные значения', () => {
      mockRoute.value = {
        query: {
          status: 'inFocus',
          page: '2',
          speakerId: 'sp1',
          areaId: 'ar1',
          sortOrder: 'asc',
          search: 'test',
        },
      };
      const { apiParams } = useQuestionsFilters();
      expect(apiParams.value).toEqual({
        page: 2,
        pageSize: 10,
        status: QuestionStatusId.InFocus,
        speakerId: 'sp1',
        areaId: 'ar1',
        search: 'test',
        sortOrder: 'asc',
      });
    });
  });

  describe('setter-методы', () => {
    it('setStatus вызывает router.push с новым status (page=1 опускается как дефолт)', () => {
      const { setStatus } = useQuestionsFilters();
      setStatus('answered');
      expect(mockPush).toHaveBeenCalledWith({
        query: { status: 'answered' },
      });
    });

    it('setStatus с дефолтным значением опускает status из query', () => {
      const { setStatus } = useQuestionsFilters();
      setStatus('new');
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setPage вызывает router.push с новым page', () => {
      const { setPage } = useQuestionsFilters();
      setPage(3);
      expect(mockPush).toHaveBeenCalledWith({ query: { page: '3' } });
    });

    it('setPage с дефолтным значением опускает page из query', () => {
      const { setPage } = useQuestionsFilters();
      setPage(1);
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setSpeakerId вызывает router.push с новым speakerId (page=1 опускается как дефолт)', () => {
      const { setSpeakerId } = useQuestionsFilters();
      setSpeakerId('sp1');
      expect(mockPush).toHaveBeenCalledWith({
        query: { speakerId: 'sp1' },
      });
    });

    it('setSpeakerId(null) удаляет speakerId из query', () => {
      mockRoute.value = { query: { speakerId: 'old' } };
      const { setSpeakerId } = useQuestionsFilters();
      setSpeakerId(null);
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setAreaId вызывает router.push с новым areaId (page=1 опускается как дефолт)', () => {
      const { setAreaId } = useQuestionsFilters();
      setAreaId('ar1');
      expect(mockPush).toHaveBeenCalledWith({
        query: { areaId: 'ar1' },
      });
    });

    it('setAreaId(null) удаляет areaId из query', () => {
      mockRoute.value = { query: { areaId: 'old' } };
      const { setAreaId } = useQuestionsFilters();
      setAreaId(null);
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setSortOrder вызывает router.push с новым sortOrder (page=1 опускается как дефолт)', () => {
      const { setSortOrder } = useQuestionsFilters();
      setSortOrder('asc');
      expect(mockPush).toHaveBeenCalledWith({
        query: { sortOrder: 'asc' },
      });
    });

    it('setSortOrder с дефолтом опускает sortOrder из query', () => {
      const { setSortOrder } = useQuestionsFilters();
      setSortOrder('desc');
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });

    it('setSearch вызывает router.push с новым search (page=1 опускается как дефолт)', () => {
      const { setSearch } = useQuestionsFilters();
      setSearch('тест');
      expect(mockPush).toHaveBeenCalledWith({
        query: { search: 'тест' },
      });
    });

    it('setSearch с пустой строкой удаляет search из query', () => {
      mockRoute.value = { query: { search: 'old' } };
      const { setSearch } = useQuestionsFilters();
      setSearch('');
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });
  });

  describe('setter-методы сохраняют другие параметры', () => {
    it('setStatus сохраняет существующий speakerId', () => {
      mockRoute.value = {
        query: { speakerId: 'sp1', sortOrder: 'asc' },
      };
      const { setStatus } = useQuestionsFilters();
      setStatus('answered');
      expect(mockPush).toHaveBeenCalledWith({
        query: {
          status: 'answered',
          speakerId: 'sp1',
          sortOrder: 'asc',
        },
      });
    });

    it('setSpeakerId сохраняет существующий status', () => {
      mockRoute.value = { query: { status: 'inFocus' } };
      const { setSpeakerId } = useQuestionsFilters();
      setSpeakerId('sp2');
      expect(mockPush).toHaveBeenCalledWith({
        query: { status: 'inFocus', speakerId: 'sp2' },
      });
    });
  });

  describe('resetFilters', () => {
    it('очищает все параметры', () => {
      mockRoute.value = {
        query: {
          status: 'answered',
          page: '5',
          speakerId: 'sp1',
          areaId: 'ar1',
          sortOrder: 'asc',
          search: 'test',
        },
      };
      const { resetFilters } = useQuestionsFilters();
      resetFilters();
      expect(mockPush).toHaveBeenCalledWith({ query: {} });
    });
  });
});
