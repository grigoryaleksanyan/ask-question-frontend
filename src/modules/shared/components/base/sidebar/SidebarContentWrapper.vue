<template>
  <v-container class="pa-0 ma-0">
    <v-row
      no-gutters
      align-content="start"
      :style="contentBlockStyle"
      class="content-block">
      <v-col cols="12">
        <slot> </slot>
      </v-col>
    </v-row>
    <v-row
      v-if="!hideButtonBlock"
      no-gutters
      :style="{ height: `${SIDEBAR_CONSTANTS.FOOTER_HEIGHT_PX}px` }"
      class="footer-block"
      align="center">
      <v-col
        cols="12"
        :style="btnBlockStyle">
        <slot name="footer"> </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SIDEBAR_CONSTANTS from './sidebar-constants';

export default {
  name: 'SidebarContentWrapper',

  props: {
    hideButtonBlock: {
      type: Boolean,
      default: false,
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

    btnBlockStyle() {
      let justifyContent = 'flex-start';

      if (this.isMobileMode) {
        justifyContent = 'center';
      }

      return `display: flex; justify-content: ${justifyContent}`;
    },

    contentBlockStyle() {
      let contentHeightVh = 100;
      let nonContentHeight = SIDEBAR_CONSTANTS.HEADER_HEIGHT_PX + SIDEBAR_CONSTANTS.FOOTER_HEIGHT_PX;

      if (this.hideButtonBlock) {
        nonContentHeight = SIDEBAR_CONSTANTS.HEADER_HEIGHT_PX;
      }

      if (this.isMobileMode) {
        contentHeightVh = `${100 - SIDEBAR_CONSTANTS.MARGIN_TOP_VH}`;
      }

      return `height: calc(${contentHeightVh}vh - ${nonContentHeight}px); overflow-y: auto`;
    },
  },
};
</script>

<style lang="scss" scoped>
.content-block {
  padding-right: 32px;
  padding-bottom: 16px;
  padding-left: 32px;
}

.footer-block {
  padding: 8px 32px;
  -webkit-box-shadow: inset 0px -1px 3px 1px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0px -1px 3px 1px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 700px) {
  .content-block {
    padding-right: 20px;
    padding-left: 20px;
  }

  .footer-block {
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>
