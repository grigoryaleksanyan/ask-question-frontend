<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h6 text-sm-h5">Обратная связь</h1>
          </v-col>
        </v-row>

        <template v-if="feedbacks.length">
          <v-row>
            <v-col
              v-for="feedback in feedbacks"
              :key="feedback.id"
              cols="12">
              <FeedbackCard
                :feedback="feedback"
                @delete="clickDeleteFeedbackBtn(feedback)" />
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col cols="12">
              <p>Обратная связь отсутствует</p>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>

    <CenterModal
      title="Удалить обратную связь"
      :is-open="showDeleteFeedback"
      @close="showDeleteFeedback = false">
      <DeleteFeedback
        v-if="showDeleteFeedback"
        :id="currentFeedback.id"
        @success="successDeleteFeedback"
        @cancel="showDeleteFeedback = false" />
    </CenterModal>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import ALERT_TYPES from '@/modules/alert/constants/alert-types';

import { GetAll } from '@/modules/feedback/repositories/feedback-repository';

import FeedbackCard from '../components/feedback/FeedbackCard.vue';
import DeleteFeedback from '../components/feedback/center-modal-content/DeleteFeedback.vue';

export default {
  name: 'AdminFeedbackView',

  components: {
    FeedbackCard,
    DeleteFeedback,
  },

  data() {
    return {
      feedbacks: [],

      currentFeedback: null,

      showDeleteFeedback: false,
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async fetchData() {
      try {
        this.ADD_LOADER();
        this.feedbacks = await GetAll();
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      } finally {
        this.REMOVE_LOADER();
      }
    },

    clickDeleteFeedbackBtn(feedback) {
      this.currentFeedback = feedback;
      this.showDeleteFeedback = true;
    },

    successDeleteFeedback(id) {
      this.feedbacks = this.feedbacks.filter((feedback) => feedback.id !== id);
      this.showDeleteFeedback = false;
    },
  },
};
</script>
