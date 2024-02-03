<template>
  <div class="logo-wrapper">
    <v-img
      position="left center"
      alt="logo"
      contain
      height="100%"
      :src="imageUrl" />
  </div>
</template>

<script>
export default {
  name: 'AppLogo',

  data() {
    return {
      imageUrl: new URL('@/core/assets/logo.png', import.meta.url).href,
    };
  },
};
</script>

<style lang="scss" scoped>
.logo-wrapper {
  max-width: 140px;
  height: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
