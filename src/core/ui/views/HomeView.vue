<template>
  <v-container
    fluid
    class="pa-0">
    <VideoBackground
      style="height: 100vh"
      :src="backgroundVideo"
      :poster="backgroundPoster"
      overlay="linear-gradient(0deg, rgb(0, 0, 0, 0.5), rgb(0, 0, 0, 0.5))">
      <v-row
        align-content="center"
        class="pa-3"
        style="height: 100vh">
        <v-col cols="12">
          <h1 class="portal-title">Ask me</h1>
          <p class="additional-text">Ты не получаешь ответов?</p>
          <p class="additional-text">Главная причина в том, что ты не задаешь вопросов.</p>
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center">
          <QuestionFormCreate />
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center mt-12">
          <v-btn
            class="btn-to-popular-question"
            color="rgba(255, 255, 255, 0.5)"
            icon
            @click="goTo('#popular', { offset: -headerHeight })">
            <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </VideoBackground>
    <v-row
      id="popular"
      class="my-5 mx-auto"
      style="max-width: 800px; min-height: 100vh">
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h3 class="text-h4 text-sm-h3 text-center">Популярные вопросы</h3>
          </v-col>
          <v-col cols="12">
            <QuestionCard
              v-for="question in questions"
              :key="question.id"
              :question="question" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useGoTo } from 'vuetify';

import VideoBackground from 'vue-responsive-video-background-player';

import QuestionCard from '@/modules/question/ui/components/QuestionCard.vue';
import QuestionFormCreate from '@/modules/question/ui/components/QuestionFormCreate.vue';

export default {
  name: 'HomeView',

  components: {
    VideoBackground,
    QuestionFormCreate,
    QuestionCard,
  },

  setup() {
    const goTo = useGoTo();
    return { goTo };
  },

  data() {
    return {
      backgroundVideo: new URL('@/core/assets/video/background.mp4', import.meta.url).href,
      backgroundPoster: new URL('@/core/assets/img/poster.jpg', import.meta.url).href,
      questions: [],

      headerHeight: 64,
    };
  },
};
</script>

<style lang="scss" scoped>
.portal-title {
  color: white;
  font-size: 6em;
  text-align: center;
  white-space: nowrap;
}

.additional-text {
  margin-bottom: 5px !important;
  color: white;
  font-size: 1.5em;
  line-height: 1;
  text-align: center;
}

@media (width <= 600px) {
  .portal-title {
    font-size: 3em;
  }

  .additional-text {
    font-size: 1em;
  }
}

.btn-to-popular-question {
  animation: pulsation 3s infinite;
}

@keyframes pulsation {
  0% {
    transform: scale(1.2, 1.2);
  }

  50% {
    transform: scale(0.9, 0.9);
  }

  100% {
    transform: scale(1.2, 1.2);
  }
}
</style>
