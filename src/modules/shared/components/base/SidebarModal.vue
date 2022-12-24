<template>
  <v-container class="pa-0 ma-0">
    <v-navigation-drawer
      width="500"
      app
      temporary
      :permanent="isOpen"
      :value="isOpen"
      :right="right"
      :class="modalClass">
      <v-row no-gutters style="height: 75px" class="pa-5 shadow-bottom">
        <v-col cols="11">
          <h5 class="text-h6 text-sm-h5 font-weight-bold text-truncate">{{ title }}</h5>
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="close"> <v-icon>mdi-window-close</v-icon> </v-btn>
        </v-col>
      </v-row>

      <v-row no-gutters align-content="start" style="height: calc(100vh - 75px); overflow-y: auto">
        <slot> </slot>
      </v-row>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  name: 'SidebarModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },

    right: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    modalClass() {
      if (this.right) {
        return 'rounded-l-lg';
      }

      return 'rounded-r-lg';
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
.shadow-bottom {
  -webkit-box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.1);
}
</style>
