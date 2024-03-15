<template>
  <div class="logo-wrapper">
    <v-img
      alt="logo"
      width="auto"
      :src="imageUrl">
    </v-img>
  </div>
</template>

<script>
export default {
  name: 'AppLogo',

  data() {
    return {
      imageUrl: new URL('@/core/assets/logo.svg', import.meta.url).href,
    };
  },
};
</script>

<style lang="scss" scoped>
.logo-wrapper {
  display: flex;
  max-width: 140px;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
}
</style>
