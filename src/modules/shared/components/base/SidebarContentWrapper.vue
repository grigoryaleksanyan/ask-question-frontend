<template>
  <v-container class="pa-0 ma-0">
    <v-row no-gutters class="px-5 py-4" align-content="start" style="height: calc(100vh - 145px); overflow-y: auto">
      <slot> </slot>
    </v-row>
    <v-row no-gutters style="height: 70px" class="px-5 py-2 shadow-top" align="center">
      <v-col cols="12">
        <slot name="footer"> </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SidebarContentWrapper',
};
</script>

<style lang="scss" scoped>
.shadow-top {
  -webkit-box-shadow: 0px -1px 3px 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0px -1px 3px 1px rgba(0, 0, 0, 0.1);
}
</style>
