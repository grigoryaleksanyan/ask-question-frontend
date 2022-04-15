<template>
  <v-container>
    <h2 class="popular-questions-title">Популярные вопросы</h2>
  </v-container>
</template>

<script>
export default {
  name: 'PopularQuestions',
};
</script>

<style lang="scss" scoped>
.popular-questions-title {
  font-weight: 400;
  font-size: 3em;
  line-height: 1;
  letter-spacing: 0.0125em;
  text-align: center;
}

@media (max-width: 600px) {
  .popular-questions-title {
    font-size: 1.5em;
  }
}
</style>
