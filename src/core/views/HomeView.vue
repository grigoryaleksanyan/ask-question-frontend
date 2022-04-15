<template>
  <v-container fluid>
    <v-row style="height: 100vh" align-content="center">
      <v-col cols="12">
        <h1 class="portal-title">Ask me</h1>
        <p class="additional-text">Ты не получаешь ответов?</p>
        <p class="additional-text">Главная причина в том, что ты не задаешь вопросов.</p>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <QuestionAddForm />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mt-12">
        <v-btn icon @click="$vuetify.goTo('#popular')">
          <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row style="height: 100vh">
      <v-col id="popular" cols="12">
        <PopularQuestions />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QuestionAddForm from '@/modules/question/components/QuestionAddForm.vue';
import PopularQuestions from '@/modules/question/components/PopularQuestions.vue';

export default {
  name: 'HomeView',
  components: {
    QuestionAddForm,
    PopularQuestions,
  },
};
</script>

<style lang="scss">
.portal-title {
  font-size: 6em;
  white-space: nowrap;
  text-align: center;
}

.additional-text {
  margin-bottom: 5px !important;
  font-size: 1.5em;
  line-height: 1;
  text-align: center;
}

@media (max-width: 600px) {
  .portal-title {
    font-size: 2em;
  }
  .additional-text {
    font-size: 1em;
  }
}
</style>
