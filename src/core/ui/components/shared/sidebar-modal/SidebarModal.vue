<template>
  <div>
    <transition name="overlay">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="closeOnClickAway ? close() : null"></div>
    </transition>
    <transition name="modal">
      <div
        v-if="isOpen || forcedSlotRender"
        class="modal-wrapper"
        :class="{ 'modal-hide': forcedSlotRender && !isOpen }">
        <slot
          :is-open="isOpen"
          :confirm="confirm"
          :close="close">
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarModal',

  provide() {
    return {
      close: this.close,
    };
  },

  props: {
    forcedSlotRender: {
      type: Boolean,
      default: false,
    },

    closeOnEsc: {
      type: Boolean,
    },

    closeOnClickAway: {
      type: Boolean,
    },
  },

  data() {
    return {
      isOpen: false,
    };
  },

  methods: {
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.close();
      }
    },

    toggleScroll(value) {
      document.querySelector('html').style.overflowY = value ? 'hidden' : 'auto';
    },

    // Используется для открытия модального окна
    // eslint-disable-next-line vue/no-unused-properties
    open() {
      let resolve;
      let reject;
      const modalPromise = new Promise((ok, fail) => {
        resolve = ok;
        reject = fail;
      });

      this.$options.modalController = { resolve, reject };

      this.isOpen = true;
      this.toggleScroll(true);

      if (this.closeOnEsc) {
        document.addEventListener('keydown', this.handleKeydown);
      }

      return modalPromise;
    },

    resolveModal(status, data) {
      this.$options.modalController.resolve({ status, data });
      this.isOpen = false;
      this.toggleScroll(false);

      if (this.closeOnEsc) {
        document.removeEventListener('keydown', this.handleKeydown);
      }
    },

    confirm(data = null) {
      this.resolveModal(true, data);
    },

    close(data = null) {
      this.resolveModal(false, data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './styles/modal-variables';

.modal-overlay {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  inset: 0;
}

.modal-wrapper {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  max-width: $modal-width;
  height: 100%;
  border-radius: 16px 0 0 16px;
  background-color: white;
}

.modal-hide {
  display: none;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.2s ease;
}

.overlay-enter,
.overlay-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter,
.modal-leave-to {
  transform: translateX(100%);
}

@media (width <= $modal-width) {
  .modal-wrapper {
    height: calc(100% - 50px);
    border-radius: 16px 16px 0 0;
    margin-top: 50px;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.2s ease;
  }

  .modal-enter,
  .modal-leave-to {
    transform: translateY(100%);
  }
}
</style>
