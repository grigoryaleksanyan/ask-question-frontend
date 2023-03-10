<template>
  <div
    tabindex="0"
    class="card"
    @click="clickOnCard"
    @keypress.enter="clickOnCard">
    <div class="card-info-block">
      <span class="card-info-block-title">{{ category.name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CategoryCard',

  props: {
    category: {
      type: Object,
      required: true,
    },
  },

  methods: {
    clickOnCard() {
      this.$router.push({ name: 'admin-faq-category', params: { id: this.category.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 116px;
  padding: 15px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #d3d4db;
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
}

.card-info-block-icon {
  width: 20px;
  height: 20px;
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
