<template>
  <div class="circles"></div>
</template>

<script>
export default {
  name: 'SidebarPreloader',
};
</script>

<style lang="scss" scoped>
$pr-color: black;
$pr-border-width: 4px;
$pr-circles-dimensions: 80px;
$pr-main-circles-dimensions: $pr-circles-dimensions - $pr-border-width * 2;

.circles {
  position: relative;
  top: calc(50% - 40px);
  left: calc(50% - 40px);
  width: $pr-circles-dimensions;
  height: $pr-circles-dimensions;

  &::before,
  &::after {
    position: absolute;
    display: block;
    border-width: $pr-border-width;
    border-style: solid;
    border-radius: 50%;
    content: '';
  }

  &::before {
    top: 0;
    left: 0;
    width: $pr-main-circles-dimensions;
    height: $pr-main-circles-dimensions;
    border-color: $pr-color;
    animation: circles-scale 1s linear 0s infinite;
  }

  &::after {
    top: 0;
    left: 0;
    width: $pr-main-circles-dimensions;
    height: $pr-main-circles-dimensions;
    border-color: $pr-color;
    animation: circles-scale 1s linear 0.5s infinite;
    opacity: 0;
  }

  @keyframes circles-scale {
    0% {
      opacity: 0;
      transform: scale(0);
    }

    50% {
      opacity: 1;
      transform: scale(0.7);
    }

    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
}
</style>
