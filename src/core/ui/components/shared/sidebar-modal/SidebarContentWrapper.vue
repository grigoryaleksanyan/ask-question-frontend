<template>
  <div class="modal-form-wrapper">
    <div
      class="modal-header"
      :style="{ height: header }">
      <span class="modal-title">
        <slot name="header"> {{ title }} </slot>
      </span>
      <button
        class="modal-close-button"
        type="button"
        title="Закрыть"
        @click="close">
        <svg
          class="button-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </button>
    </div>
    <div
      class="modal-content"
      :style="{ height: content }">
      <slot> </slot>
    </div>
    <div
      v-if="$slots.footer"
      class="modal-footer"
      :style="{ height: footer }">
      <slot name="footer"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarContentWrapper',
  inject: ['close'],

  props: {
    title: { type: String, default: '' },
    headerHeight: { type: Number, default: 75 },
    footerHeight: { type: Number, default: 70 },
  },

  computed: {
    header() {
      return `${this.headerHeight}px`;
    },

    content() {
      return `calc(100% - ${this.header} - ${this.footer})`;
    },

    footer() {
      return `${this.$slots.footer ? this.footerHeight : 0}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
@use './styles/modal-variables';

$header-paddings: modal-variables.$header-paddings;
$content-paddings: modal-variables.$content-paddings;
$footer-paddings: modal-variables.$footer-paddings;
$section-mobile-paddings: modal-variables.$section-mobile-paddings;
$modal-width: modal-variables.$modal-width;

.modal-form-wrapper {
  height: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $header-paddings;
}

.modal-title {
  overflow: hidden;
  margin-right: 10px;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgb(225 225 225 / 90%);
  }
}

.button-icon {
  width: 20px;
  height: 20px;
}

.modal-content {
  padding: $content-paddings;
  overflow-y: auto;
  overscroll-behavior: none;
  scrollbar-gutter: stable;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: $footer-paddings;
  box-shadow: 0 -1px 0 0 rgba(#000, 0.1);
  gap: 12px;
}

@media (width <= $modal-width) {
  .modal-header {
    padding: $section-mobile-paddings;
  }

  .modal-content {
    padding: $section-mobile-paddings;
  }

  .modal-footer {
    justify-content: center;
    padding: $section-mobile-paddings;
  }
}
</style>
