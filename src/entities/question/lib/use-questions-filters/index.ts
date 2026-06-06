import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { QuestionListParams } from '../../api/questions-repository';

import { QuestionStatusId } from '@/shared/dto';

const DEFAULT_STATUS = 'new';
const DEFAULT_PAGE = 1;
const DEFAULT_SORT_ORDER = 'desc';

const VALID_STATUSES = ['new', 'inFocus', 'answered'] as const;
type StatusKey = (typeof VALID_STATUSES)[number];

const statusToId: Record<StatusKey, QuestionStatusId> = {
  new: QuestionStatusId.New,
  inFocus: QuestionStatusId.InFocus,
  answered: QuestionStatusId.Answered,
};

function parseStatus(value: unknown): StatusKey {
  if (
    typeof value === 'string' &&
    VALID_STATUSES.includes(value as StatusKey)
  ) {
    return value as StatusKey;
  }
  return DEFAULT_STATUS;
}

function parsePage(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : DEFAULT_PAGE;
}

function parseSortOrder(value: unknown): 'asc' | 'desc' {
  if (value === 'asc' || value === 'desc') return value;
  return DEFAULT_SORT_ORDER;
}

function parseNullableString(value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) return value;
  return null;
}

function parseSearch(value: unknown): string {
  if (typeof value === 'string' && value.length > 0) return value;
  return '';
}

interface QueryOverrides {
  status?: StatusKey;
  page?: number;
  speakerId?: string | null;
  areaId?: string | null;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export const PAGE_SIZE = 10;

export function useQuestionsFilters() {
  const route = useRoute();
  const router = useRouter();

  const status = computed(() => parseStatus(route.query.status));
  const page = computed(() => parsePage(route.query.page));
  const speakerId = computed(() => parseNullableString(route.query.speakerId));
  const areaId = computed(() => parseNullableString(route.query.areaId));
  const sortOrder = computed(() => parseSortOrder(route.query.sortOrder));
  const search = computed(() => parseSearch(route.query.search));

  function buildQuery(overrides: QueryOverrides): Record<string, string> {
    const finalStatus =
      overrides.status !== undefined ? overrides.status : status.value;
    const finalPage =
      overrides.page !== undefined ? overrides.page : page.value;
    const finalSpeakerId =
      overrides.speakerId !== undefined ? overrides.speakerId : speakerId.value;
    const finalAreaId =
      overrides.areaId !== undefined ? overrides.areaId : areaId.value;
    const finalSortOrder =
      overrides.sortOrder !== undefined ? overrides.sortOrder : sortOrder.value;
    const finalSearch =
      overrides.search !== undefined ? overrides.search : search.value;

    const query: Record<string, string> = {};

    if (finalStatus !== DEFAULT_STATUS) query.status = finalStatus;
    if (finalPage !== DEFAULT_PAGE) query.page = String(finalPage);
    if (finalSpeakerId) query.speakerId = finalSpeakerId;
    if (finalAreaId) query.areaId = finalAreaId;
    if (finalSortOrder !== DEFAULT_SORT_ORDER) query.sortOrder = finalSortOrder;
    if (finalSearch) query.search = finalSearch;

    return query;
  }

  function setStatus(value: StatusKey) {
    router.push({ query: buildQuery({ status: value, page: 1 }) });
  }

  function setPage(value: number) {
    router.push({ query: buildQuery({ page: value }) });
  }

  function setSpeakerId(value: string | null) {
    router.push({
      query: buildQuery({ speakerId: value, page: 1 }),
    });
  }

  function setAreaId(value: string | null) {
    router.push({
      query: buildQuery({ areaId: value, page: 1 }),
    });
  }

  function setSortOrder(value: 'asc' | 'desc') {
    router.push({ query: buildQuery({ sortOrder: value, page: 1 }) });
  }

  function setSearch(value: string) {
    router.push({
      query: buildQuery({ search: value, page: 1 }),
    });
  }

  function resetFilters() {
    router.push({ query: {} });
  }

  const apiParams = computed<QuestionListParams>(() => ({
    page: page.value,
    pageSize: PAGE_SIZE,
    status: statusToId[status.value],
    speakerId: speakerId.value ?? undefined,
    areaId: areaId.value ?? undefined,
    search: search.value || undefined,
    sortOrder: sortOrder.value,
  }));

  return {
    status,
    page,
    speakerId,
    areaId,
    sortOrder,
    search,
    apiParams,
    setStatus,
    setPage,
    setSpeakerId,
    setAreaId,
    setSortOrder,
    setSearch,
    resetFilters,
  };
}
