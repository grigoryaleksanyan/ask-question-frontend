<template>
  <v-container
    fluid
    class="pa-0">
    <VideoBackground
      style="height: 100vh"
      :src="require('@/core/assets/video/background.mp4')"
      :poster="require('@/core/assets/img/poster.jpg')"
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
            color="rgba(255, 255, 255, 0.6)"
            icon
            @click="$vuetify.goTo('#popular')">
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
        <h3 class="text-h4 text-sm-h3 text-center">Популярные вопросы</h3>
      </v-col>
      <v-col cols="12">
        <QuestionCard
          v-for="question in questions"
          :key="question.id"
          :question="question" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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

  data() {
    return {
      questions: [
        {
          id: 1,
          speaker: 'Иван Иванов',
          status: 0,
          text: `Принимая во внимание показатели успешности, новая модель организационной деятельности
          однозначно фиксирует необходимость поставленных обществом задач.`,
          views: 99,
          likes: 999,
          dislikes: 1000,
        },
        {
          id: 2,
          speaker: 'Иван Иванов',
          status: 1,
          text: `Ясность нашей позиции очевидна: базовый вектор развития является качественно новой ступенью распределения
          внутренних резервов и ресурсов. Учитывая ключевые сценарии поведения, синтетическое
          тестирование предполагает независимые способы реализации кластеризации усилий.`,
          views: 99,
          likes: 999,
          dislikes: 1000,
        },
        {
          id: 3,
          speaker: 'Иван Иванов',
          status: 2,
          text: `Принимая во внимание показатели успешности, новая модель организационной деятельности
          однозначно фиксирует необходимость поставленных обществом задач. Ясность нашей позиции
          очевидна: базовый вектор развития является качественно новой ступенью распределения
          внутренних резервов и ресурсов. Учитывая ключевые сценарии поведения, синтетическое
          тестирование предполагает независимые способы реализации кластеризации усилий.`,
          views: 99,
          likes: 999,
          dislikes: 1000,
        },
        {
          id: 4,
          speaker: 'Иван Иванов',
          status: 3,
          text: `Принимая во внимание показатели успешности, новая модель организационной деятельности
          однозначно фиксирует необходимость поставленных обществом задач. Ясность нашей позиции
          очевидна: базовый вектор развития является качественно новой ступенью распределения
          внутренних резервов и ресурсов. Учитывая ключевые сценарии поведения, синтетическое
          тестирование предполагает независимые способы реализации кластеризации усилий.`,
          views: 99,
          likes: 999,
          dislikes: 1000,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.portal-title {
  color: white;
  font-size: 6em;
  white-space: nowrap;
  text-align: center;
}

.additional-text {
  margin-bottom: 5px !important;
  color: white;
  font-size: 1.5em;
  line-height: 1;
  text-align: center;
}

@media (max-width: 600px) {
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
