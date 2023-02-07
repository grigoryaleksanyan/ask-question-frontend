<template>
  <v-container class="pa-0 ma-0">
    <v-navigation-drawer
      :width="isMobileMode ? '100%' : '700'"
      mobile-breakpoint="700"
      app
      temporary
      right
      :bottom="isMobileMode"
      :permanent="isOpen"
      :value="isOpen"
      :style="sidebarStyle"
      class="sidebar-radius">
      <v-row
        v-touch="{
          down: () => close(),
        }"
        no-gutters
        :style="{ height: `${SIDEBAR_CONSTANTS.HEADER_HEIGHT_PX}px` }"
        class="header-block">
        <v-col
          v-if="isMobileMode"
          cols="12"
          class="d-flex justify-center">
          <div class="mobile-touch-close-btn"></div>
        </v-col>
        <v-col
          cols="11"
          align-self="center">
          <h5 class="text-truncate sidebar-title">
            {{ title }}
          </h5>
        </v-col>
        <v-col
          v-if="!isMobileMode"
          align-self="center"
          cols="1"
          class="d-flex justify-end">
          <v-btn
            class="pa-0"
            elevation="0"
            min-width="40"
            max-width="40"
            min-height="40"
            max-height="40"
            width="40"
            height="40"
            style="border-radius: 8px"
            @click="close">
            <v-icon>mdi-plus mdi-rotate-45</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row
        no-gutters
        align-content="start"
        :style="contentBlockStyle">
        <v-col cols="12">
          <slot> </slot>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import SIDEBAR_CONSTANTS from './sidebar-constants';

export default {
  name: 'SidebarModal',

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      SIDEBAR_CONSTANTS,
    };
  },

  computed: {
    isMobileMode() {
      return this.$vuetify.breakpoint.width < 700;
    },

    sidebarStyle() {
      let marginTop = 0;

      if (this.isMobileMode) {
        marginTop = `${SIDEBAR_CONSTANTS.MARGIN_TOP_VH}vh`;
      }

      return `margin-top: ${marginTop}`;
    },

    contentBlockStyle() {
      let contentHeightVh = 100;

      if (this.isMobileMode) {
        contentHeightVh = `${100 - SIDEBAR_CONSTANTS.MARGIN_TOP_VH}`;
      }

      return `height: calc(${contentHeightVh}vh - ${SIDEBAR_CONSTANTS.HEADER_HEIGHT_PX}px); overflow-y: auto`;
    },
  },

  watch: {
    isOpen(value) {
      document.querySelector('html').style.overflowY = value ? 'hidden' : 'auto';
    },
  },

  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-radius {
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}

.header-block {
  padding: 12px 32px;
}

.sidebar-title {
  color: var(--v-text-color-base);
  font-weight: 600;
  font-size: 22px;
  font-style: normal;
  line-height: 24px;
  text-align: left;
}

.mobile-touch-close-btn {
  width: 40px;
  height: 4px;
  background: #cecece;
  border-radius: 4px;
}

@media screen and (max-width: 700px) {
  .sidebar-radius {
    border-top-right-radius: 16px;
    border-bottom-left-radius: 0px;
  }

  .header-block {
    padding-right: 20px;
    padding-left: 20px;
  }

  .sidebar-title {
    font-size: 18px;
    line-height: 20px;
  }
}
</style>
