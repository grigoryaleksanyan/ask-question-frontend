<template>
  <v-container fluid>
    <v-row style="height: 100vh">
      <VideoBackground
        :src="require('@/core/assets/video/background.mp4')"
        :poster="require('@/core/assets/img/poster.jpg')"
        overlay="linear-gradient(0deg, rgb(0, 0, 0, 0.5), rgb(0, 0, 0, 0.5))">
        <v-row style="height: 100vh" align-content="center" class="pa-2">
          <v-col cols="12">
            <h1 class="portal-title">Ask me</h1>
            <p class="additional-text">Ты не получаешь ответов?</p>
            <p class="additional-text">Главная причина в том, что ты не задаешь вопросов.</p>
          </v-col>
          <v-col cols="12" class="d-flex justify-center">
            <QuestionAddForm />
          </v-col>
          <v-col cols="12" class="d-flex justify-center mt-12">
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
    </v-row>
    <v-row style="min-height: 100vh">
      <v-col id="popular" cols="12" class="my-5">
        <v-container class="pa-0">
          <v-row>
            <v-col cols="12" class="mb-2">
              <h3 class="text-h4 text-sm-h3 text-center">Популярные вопросы</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <QuestionFilters />
            </v-col>
          </v-row>
          <v-row v-for="question in questions" :key="question.id">
            <v-col cols="12" class="d-flex justify-center">
              <QuestionCard :question="question" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoBackground from 'vue-responsive-video-background-player';

import QuestionAddForm from '@/modules/question/components/QuestionAddForm.vue';
import QuestionCard from '@/modules/question/components/QuestionCard.vue';
import QuestionFilters from '@/modules/question/components/QuestionFilters.vue';

export default {
  name: 'HomeView',
  components: {
    VideoBackground,
    QuestionAddForm,
    QuestionCard,
    QuestionFilters,
  },
  data() {
    return {
      questions: [
        {
          id: 1,
          speaker: 'Иван Иванов',
          status: 0,
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
          id: 2,
          speaker: 'Иван Иванов',
          status: 1,
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
        {
          id: 5,
          speaker: 'Иван Иванов',
          status: 1,
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

<style lang="scss">
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
    -webkit-transform: scale(1.2, 1.2);
    transform: scale(1.2, 1.2);
  }
  50% {
    -webkit-transform: scale(0.9, 0.9);
    transform: scale(0.9, 0.9);
  }
  100% {
    -webkit-transform: scale(1.2, 1.2);
    transform: scale(1.2, 1.2);
  }
}
</style>
