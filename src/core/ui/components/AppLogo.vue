<template>
  <div class="logo-wrapper">
    <v-img
      position="left center"
      alt="logo"
      contain
      height="100%"
      :src="require('@/core/assets/logo.png')" />
  </div>
</template>

<script>
export default {
  name: 'AppLogo',
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
