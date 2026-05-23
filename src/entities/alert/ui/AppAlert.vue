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

  computed: {
    ...mapGetters('alert', ['GET_ALERTS']),
  },
};
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  z-index: 1000;
  top: 75px;
  right: 10px;
  width: 370px;
}

@media (width <= 400px) {
  .alert {
    right: unset;
    left: 50%;
    width: 300px;
    transform: translateX(-50%);
  }
}
</style>
