<template>
  <div
    tabindex="0"
    class="card"
    @click="$emit('click')"
    @keypress.enter="$emit('click')">
    <div class="card-info-block">
      <h4 class="card-info-block-title">{{ title }}</h4>
      <svg
        class="card-info-block-icon"
        viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateCardButton',

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 116px;
  justify-content: center;
  padding: 15px;
  border: 1px dashed #d3d4db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s linear;
}

.card-info-block {
  display: flex;
  align-items: center;
}

.card-info-block-title {
  margin-right: 10px;
  color: #000;
  font-weight: bold;
}

.card-info-block-icon {
  width: 20px;
  min-width: 20px;
  height: 20px;
  min-height: 20px;
}

.card-info-block-title,
.card-info-block-icon {
  transition: all 0.2s linear;
}

.card:hover {
  box-shadow: 0 0 15px 0 rgb(180 180 180 / 65%);

  .card-info-block-title {
    color: #2b82e6;
  }

  .card-info-block-icon {
    color: #2b82e6;
  }
}
</style>
