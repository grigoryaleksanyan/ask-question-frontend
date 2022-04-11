<template>
  <div>
    <v-navigation-drawer v-model="drawer" app temporary dark> </v-navigation-drawer>

    <v-app-bar app dark>
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <v-app-bar-title class="ss">Заголовок</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <p>Стандартный слой</p>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app dark> @{{ year }} Grigory Aleksanyan </v-footer>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    year() {
      const now = new Date();
      return now.getFullYear();
    },
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>
