<template>
  <div
    tabindex="0"
    class="create-card"
    @click="$emit('click')"
    @keypress.enter="$emit('click')">
    <div class="card-info-block">
      <span class="card-info-block__title">{{ title }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CategoryCard',

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
  border: 1px solid #d3d4db;
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
}

.card-info-block__icon {
  width: 20px;
  height: 20px;
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
