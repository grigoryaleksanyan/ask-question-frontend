<template>
  <div
    tabindex="0"
    class="category-card"
    @click="clickOnCard"
    @keypress.enter="clickOnCard">
    <div class="category-card__info">
      <span class="category-card__title">{{ category.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import type { FaqCategoryWithEntriesResponse } from '@/shared/types';

defineOptions({ name: 'CategoryCard' });

const { category } = defineProps<{
  category: FaqCategoryWithEntriesResponse;
}>();

const router = useRouter();

function clickOnCard() {
  router.push({
    name: 'admin-faq-category',
    params: { id: category.id },
  });
}
</script>

<style lang="scss" scoped>
.category-card {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 116px;
  justify-content: center;
  padding: 15px;
  border: 1px solid variables.$border-light;
  border-radius: 12px;
  background-color: variables.$card-bg;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card__info {
  display: flex;
  align-items: center;
}

.category-card__title {
  margin-right: 10px;
  color: #000;
  transition: color 0.2s ease;
}

.category-card:hover {
  box-shadow: 0 0 15px 0 rgb(0 0 0 / 10%);

  .category-card__title {
    color: variables.$link-hover;
  }
}

.vuedraggable-drag > .category-card {
  transform: rotate(3deg);
}

.vuedraggable-ghost > .category-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(230 230 230);
  content: '';
}
</style>
