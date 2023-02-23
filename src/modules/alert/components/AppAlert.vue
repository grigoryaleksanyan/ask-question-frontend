<template>
  <div class="alert">
    <transition-group name="scroll-y-reverse-transition">
      <AppAlertItem
        v-for="alert in GET_ALERTS"
        :key="alert.id"
        :alert="alert" />
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppAlertItem from './AppAlertItem.vue';

export default {
  name: 'AppAlert',

  components: {
    AppAlertItem,
  },

  data() {
    return {
      showAlert: true,
    };
  },

  computed: {
    ...mapGetters('alert', ['GET_ALERTS']),
  },
};
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  top: 75px;
  right: 10px;
  z-index: 1000;
  width: 370px;
}

@media (max-width: 400px) {
  .alert {
    right: unset;
    left: 50%;
    width: 300px;
    transform: translateX(-50%);
  }
}
</style>
