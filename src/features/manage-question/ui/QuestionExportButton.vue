<template>
  <SplitButton
    label="Экспорт"
    icon="pi pi-download"
    :model="menuItems"
    :disabled="selectedIds.size === 0"
    size="small"
    @click="onMainClick" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { QuestionResponse } from '@/shared/dto';

import SplitButton from 'primevue/splitbutton';
import { useToast } from 'primevue/usetoast';

import { exportToDocx } from '../lib/export-docx';
import { exportToXlsx } from '../lib/export-xlsx';

defineOptions({ name: 'QuestionExportButton' });

const { selectedIds, questions } = defineProps<{
  selectedIds: Set<string>;
  questions: QuestionResponse[];
}>();

const toast = useToast();
const isExporting = ref(false);

const menuItems = [
  {
    label: 'Скачать DOCX',
    icon: 'pi pi-file-word',
    command: () => handleExport('docx'),
  },
  {
    label: 'Скачать XLSX',
    icon: 'pi pi-file-excel',
    command: () => handleExport('xlsx'),
  },
];

function getSelectedQuestions(): QuestionResponse[] {
  return questions.filter((q) => selectedIds.has(q.id));
}

function onMainClick() {
  handleExport('docx');
}

async function handleExport(format: 'docx' | 'xlsx') {
  const selected = getSelectedQuestions();

  if (selected.length === 0) {
    toast.add({
      severity: 'warn',
      detail: 'Выберите вопросы для экспорта',
      group: 'api',
      life: 3000,
    });
    return;
  }

  isExporting.value = true;

  try {
    await (format === 'docx' ? exportToDocx(selected) : exportToXlsx(selected));

    toast.add({
      severity: 'success',
      detail: `Экспортировано ${selected.length} вопросов в ${format.toUpperCase()}`,
      group: 'api',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      detail: 'Ошибка при экспорте файла',
      group: 'api',
      life: 3000,
    });
  } finally {
    isExporting.value = false;
  }
}
</script>
