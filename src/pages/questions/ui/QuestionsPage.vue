<template>
  <QuestionsView
    :areas="areaItems"
    :speakers="speakerItems" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { AreaResponse, SpeakerPublicResponse } from '@/shared/dto';

import { GetAllAreas } from '@/entities/area';
import { GetAllPublicSpeakers } from '@/entities/user';
import { QuestionsView } from '@/entities/question';
import { useApiCall } from '@/shared/lib';

defineOptions({ name: 'QuestionsPage' });

const { execute: executeFetchSpeakers } = useApiCall(GetAllPublicSpeakers, {
  showPreloader: false,
});
const { execute: executeFetchAreas } = useApiCall(GetAllAreas, {
  showPreloader: false,
});

const areaItems = ref<AreaResponse[]>([]);
const speakerItems = ref<SpeakerPublicResponse[]>([]);

onMounted(async () => {
  const [speakers, areas] = await Promise.all([
    executeFetchSpeakers(),
    executeFetchAreas(),
  ]);
  if (speakers) {
    speakerItems.value = speakers;
  }
  if (areas) {
    areaItems.value = areas;
  }
});
</script>
