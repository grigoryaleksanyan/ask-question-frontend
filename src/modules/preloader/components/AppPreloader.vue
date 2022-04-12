<template>
  <v-overlay :value="SHOW_PRELOADER" style="z-index: 9">
    <v-progress-circular :size="70" color="primary" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AppPreloader',
  computed: {
    ...mapGetters('preloader', ['SHOW_PRELOADER']),
  },
};
</script>
