<template>
  <div :class="alertClasses">
    <span class="alert-item-icon">
      <component :is="`${alert.type}-icon`" />
    </span>

    <p class="alert-item-text">{{ alert.text }}</p>

    <button
      type="button"
      title="Закрыть"
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
  components: { SuccessIcon, InfoIcon, WarningIcon, ErrorIcon, CloseIcon },
  props: { alert: { type: Object, required: true } },

  computed: {
    alertClasses() {
      return { 'alert-item': true, [`alert-item-${this.alert.type}`]: true };
    },
  },

  methods: { ...mapMutations('alert', ['REMOVE_ALERT']) },
};
</script>

<style lang="scss" scoped>
%icon-sizes {
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
}

.alert-item {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: variables.$primary-color;
  box-shadow:
    0 3px 1px -2px rgb(0 0 0 / 20%),
    0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
  color: #fff;

  &-success {
    background-color: variables.$success-color;
  }

  &-info {
    background-color: variables.$info-color;
  }

  &-warning {
    background-color: variables.$warning-color;
  }

  &-error {
    background-color: variables.$error-color;
  }
}

.alert-item-icon {
  @extend %icon-sizes;

  margin-right: 10px;
}

.alert-item-text {
  flex-grow: 1;
  margin: 0;
  margin-right: 10px;
}

.alert-item-button {
  @extend %icon-sizes;
}
</style>
