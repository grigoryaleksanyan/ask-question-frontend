<template>
  <div
    class="alert-item"
    :class="`alert-item_${alert.type}`">
    <div class="alert-item-icon">
      <component :is="`${alert.type}-icon`" />
    </div>

    <p class="alert-item-text">{{ alert.text }}</p>

    <button
      type="button"
      class="alert-item-button"
      @click="REMOVE_ALERT(alert.id)">
      <CloseIcon />
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import SuccessIcon from './icons/SuccessIcon.vue';
import InfoIcon from './icons/InfoIcon.vue';
import WarningIcon from './icons/WarningIcon.vue';
import ErrorIcon from './icons/ErrorIcon.vue';

import CloseIcon from './icons/CloseIcon.vue';

export default {
  name: 'AppAlertItem',

  components: {
    SuccessIcon,
    InfoIcon,
    WarningIcon,
    ErrorIcon,

    CloseIcon,
  },

  props: {
    alert: {
      type: Object,
      required: true,
    },
  },

  methods: {
    ...mapMutations('alert', ['REMOVE_ALERT']),
  },
};
</script>

<style lang="scss" scoped>
.alert-item {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  padding: 15px;
  background-color: #4caf50;
  border-radius: 5px;

  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.alert-item_success {
  background-color: #4caf50;
}

.alert-item_info {
  background-color: #2196f3;
}

.alert-item_warning {
  background-color: #fb8c00;
}

.alert-item_error {
  background-color: #ff5252;
}

.alert-item-icon {
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
  margin-right: 10px;
  color: #ffffff;
}

.alert-item-text {
  flex-grow: 1;
  margin: 0;
  margin-right: 10px;
  color: #ffffff;
}

.alert-item-button {
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
  color: #ffffff;
}
</style>
