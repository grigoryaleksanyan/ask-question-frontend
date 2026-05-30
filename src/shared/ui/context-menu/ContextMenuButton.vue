<template>
  <Menu
    ref="menuRef"
    :model="items"
    popup />
  <Button
    text
    size="small"
    icon="pi pi-ellipsis-v"
    class="context-menu-btn"
    @click="toggle" />
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { MenuItem } from 'primevue/menuitem';

import Menu from 'primevue/menu';
import Button from 'primevue/button';

defineOptions({ name: 'ContextMenuButton' });

const { items } = defineProps<{
  items: MenuItem[];
}>();

const menuRef = useTemplateRef('menuRef');

function toggle(event: Event) {
  menuRef.value?.toggle(event);
}
</script>

<style lang="scss" scoped>
.context-menu-btn {
  padding: 4px 8px !important;
}
</style>
