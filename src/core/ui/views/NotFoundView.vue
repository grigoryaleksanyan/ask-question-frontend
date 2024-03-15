<template>
  <v-container fluid>
    <v-row
      align="center"
      style="height: 100vh">
      <v-col
        cols="12"
        class="d-flex flex-column align-center">
        <h1 class="text-h6 text-sm-h4 mb-8">Такой страницы не существует &#128577;</h1>
        <v-btn
          variant="flat"
          @click="toBack()">
          Вернуться
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotFoundView',

  methods: {
    toBack() {
      this.$router.go(-1);
    },
  },
};
</script>
