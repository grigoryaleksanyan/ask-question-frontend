<template>
  <v-container
    fluid
    style="max-width: 1200px">
    <v-row no-gutters>
      <v-col
        cols="12"
        class="my-8">
        <h1 class="text-h4 text-sm-h3 text-center">Часто задаваемые вопросы</h1>
      </v-col>
    </v-row>

    <v-row
      justify="center"
      class="mb-8">
      <v-col
        cols="12"
        sm="3">
        <h2 class="text-h6 text-sm-h5 mb-3 section-title">Удаленная работа</h2>
      </v-col>
      <v-col
        cols="12"
        sm="9">
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(item, i) in 2"
            :key="i">
            <v-expansion-panel-header> Item </v-expansion-panel-header>
            <v-expansion-panel-content>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'FAQView',
};
</script>
<style lang="scss" scoped>
.section-title {
  padding-left: 10px;
  border-left: 5px solid $main-color;
}
</style>
