<template>
  <div class="category-card">
    <div class="category-card__header">
      <span class="category-card__drag-handle drag-handle">⠷</span>
      <span
        class="category-card__name"
        tabindex="0"
        @click="navigateToCategory"
        @keypress.enter="navigateToCategory">
        {{ category.name }}
      </span>
      <span class="category-card__count">{{ entryCountText }}</span>
      <ContextMenuButton :items="menuItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import type { FaqCategoryWithEntriesResponse } from '@/shared/dto';

import { ContextMenuButton } from '@/shared/ui/context-menu';

defineOptions({ name: 'CategoryCard' });

const { category } = defineProps<{
  category: FaqCategoryWithEntriesResponse;
}>();

const emit = defineEmits<{
  update: [];
  delete: [];
}>();

const router = useRouter();

const entryCountText = computed(() => {
  const count = category.entries?.length ?? 0;
  const forms = ['записей', 'запись', 'записи'];
  const abs = Math.abs(count) % 100;
  const idx = abs > 10 && abs < 20 ? 0 : ([0, 1, 2, 2, 2][abs % 10] ?? 0);

  return `${count} ${forms[idx]}`;
});

const menuItems = computed(() => [
  {
    label: 'Изменить',
    icon: 'pi pi-pencil',
    command: () => emit('update'),
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: () => emit('delete'),
  },
]);

function navigateToCategory() {
  router.push({
    name: 'admin-faq-category',
    params: { id: category.id },
  });
}
</script>

<style lang="scss" scoped>
.category-card {
  border: 1px solid variables.$border-dark;
  border-radius: 10px;
  margin-bottom: 12px;
  background: variables.$surface-dark-elevated;
}

.category-card__header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
}

.category-card__drag-handle {
  color: variables.$text-secondary;
  cursor: grab;
  font-size: 12px;
}

.category-card__name {
  flex: 1;
  color: variables.$text-primary-dark;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.category-card__name:hover {
  color: variables.$main-color;
}

.category-card__count {
  color: variables.$text-secondary;
  font-size: 11px;
}

.vuedraggable-drag > .category-card {
  transform: rotate(2deg);
}

.vuedraggable-ghost > .category-card {
  opacity: 0.5;
}
</style>
