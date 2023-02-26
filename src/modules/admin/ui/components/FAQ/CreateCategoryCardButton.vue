<template>
  <div
    tabindex="0"
    class="create-card"
    @click="$emit('click')"
    @keypress.enter="$emit('click')">
    <div class="card-info-block">
      <h4 class="card-info-block__title">{{ title }}</h4>
      <svg
        class="card-info-block__icon"
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
  name: 'CreateCategoryCardButton',

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.create-card {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 116px;
  padding: 15px;
  overflow: hidden;
  border: 1px dashed #d3d4db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s linear;
}

.card-info-block {
  display: flex;
  align-items: center;
}

.card-info-block__title {
  margin-right: 10px;
  color: #000;
  font-weight: bold;
}

.card-info-block__icon {
  width: 20px;
  min-width: 20px;
  height: 20px;
  min-height: 20px;
}

.card-info-block__title,
.card-info-block__icon {
  transition: all 0.2s linear;
}

.create-card:hover {
  -webkit-box-shadow: 0px 0px 15px 0px rgb(180, 180, 180, 0.65);
  box-shadow: 0px 0px 15px 0px rgb(180, 180, 180, 0.65);

  .card-info-block__title {
    color: #2b82e6;
  }

  .card-info-block__icon {
    color: #2b82e6;
  }
}
</style>
