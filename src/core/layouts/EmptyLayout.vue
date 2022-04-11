<template>
  <v-main>
    <v-container fluid>
      <p>Пустой слой</p>
      <router-view />
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: 'EmptyLayout',
};
</script>
