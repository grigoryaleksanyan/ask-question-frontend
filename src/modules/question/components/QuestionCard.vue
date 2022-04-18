<template>
  <v-card to="/card" elevation="2" width="750" color="#E8EAF6">
    <v-card-title>
      <v-row no-gutters class="text-caption text-sm-body-2">
        <v-col cols="12" sm="6">
          <span>кому: {{ question.speaker }}</span>
        </v-col>
        <v-col class="d-flex justify-start justify-sm-end" cols="12" sm="6">
          <QuestionStatus :status="question.status" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <div class="d-flex">
        <v-sheet :color="color" height="auto" width="7"> </v-sheet>
        <v-sheet color="white" height="auto" width="100%" class="pa-3">
          <p style="color: grey" class="pa-0 ma-0 text-sm-body-1 text-body-2">
            {{ sliceText(question.text) }}
          </p>
        </v-sheet>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-container fluid class="py-0">
        <v-row no-gutters align="center">
          <v-col align-self="center">
            <v-icon title="Количество просмотров" size="20" class="mr-2"> mdi-eye </v-icon>
            <span class="text-caption text-sm-body-2">{{ replaceСounter(question.views) }}</span>
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-btn icon class="mr-1" @click.prevent="setLike">
              <v-icon title="Понравился" size="20"> mdi-thumb-up-outline </v-icon>
            </v-btn>
            <span class="text-caption text-sm-body-2 mr-1">{{ replaceСounter(question.likes) }}</span>
            <v-btn icon class="mr-1" @click.prevent="setDislike">
              <v-icon title="Не понравился" size="20"> mdi-thumb-down-outline </v-icon>
            </v-btn>
            <span class="text-caption text-sm-body-2"> {{ replaceСounter(question.dislikes) }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Q_NEW_COLOR, Q_FOCUS_COLOR, Q_COMMENT_COLOR, Q_ANSWERED_COLOR } from '@/core/constants/question-status-colors';
import QuestionStatus from '@/modules/question/components/QuestionStatus.vue';

export default {
  name: 'QuestionCard',
  components: {
    QuestionStatus,
  },
  props: {
    question: {
      type: Object,
      default() {
        return {
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
        };
      },
    },
  },
  computed: {
    color() {
      switch (this.question.status) {
        case 0:
          return Q_NEW_COLOR;
        case 1:
          return Q_FOCUS_COLOR;
        case 2:
          return Q_COMMENT_COLOR;
        default:
          return Q_ANSWERED_COLOR;
      }
    },
  },
  methods: {
    sliceText(text) {
      return `${text.slice(0, 280)}...`;
    },
    replaceСounter(value) {
      return value > 999 ? '999+' : value;
    },

    setLike() {},

    setDislike() {},
  },
};
</script>
