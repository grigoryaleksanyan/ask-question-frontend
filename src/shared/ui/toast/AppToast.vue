<template>
  <Toast
    position="top-right"
    group="api"
    :breakpoints="{ '600px': { width: '100%', right: '0', top: '0' } }">
    <template #container="{ message, closeCallback }">
      <div :class="wrapperClasses(message.severity)">
        <span :class="toastIconClass(message.severity)"></span>

        <p class="app-toast__text">{{ message.detail }}</p>

        <button
          type="button"
          title="Закрыть"
          class="app-toast__close"
          @click="closeCallback">
          <span class="pi pi-times"></span>
        </button>

        <div
          v-if="message.severity !== 'error' && message.life"
          class="app-toast__progress"
          :style="{ animationDuration: `${message.life}ms` }"></div>
      </div>
    </template>
  </Toast>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';

defineOptions({ name: 'AppToast' });

const severityIconMap: Record<string, string> = {
  success: 'pi pi-check',
  info: 'pi pi-info-circle',
  warn: 'pi pi-exclamation-triangle',
  error: 'pi pi-times-circle',
};

function wrapperClasses(severity: string) {
  return {
    'app-toast': true,
    [`app-toast--${severity}`]: true,
  };
}

function toastIconClass(severity: string) {
  return `app-toast__icon ${severityIconMap[severity] ?? ''}`;
}
</script>

<style lang="scss" scoped>
.app-toast {
  position: relative;
  display: flex;
  overflow: hidden;
  align-items: center;
  padding: 15px;

  &--success {
    border-color: variables.$success-color;
  }

  &--info {
    border-color: variables.$info-color;
  }

  &--warn {
    border-color: variables.$warning-color;
  }

  &--error {
    border-color: variables.$error-color;
  }
}

.app-toast__icon {
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin-right: 10px;
  font-size: 24px;
  line-height: 24px;

  .app-toast--success & {
    color: variables.$success-color;
  }

  .app-toast--info & {
    color: variables.$info-color;
  }

  .app-toast--warn & {
    color: variables.$warning-color;
  }

  .app-toast--error & {
    color: variables.$error-color;
  }
}

.app-toast__text {
  flex-grow: 1;
  margin: 0;
  margin-right: 10px;
  color: #1f2937;
  font-size: 0.875rem;
}

.app-toast__close {
  display: flex;
  width: 24px;
  min-width: 24px;
  height: 24px;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  color: #717171;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;

  &:hover {
    color: #1f2937;
  }
}

.app-toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  animation-fill-mode: forwards;
  animation-name: app-toast-progress;
  animation-timing-function: linear;

  .app-toast--success & {
    background-color: variables.$success-color;
  }

  .app-toast--info & {
    background-color: variables.$info-color;
  }

  .app-toast--warn & {
    background-color: variables.$warning-color;
  }
}

@keyframes app-toast-progress {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

@media (width <= 600px) {
  .app-toast {
    width: 100%;
  }
}
</style>
