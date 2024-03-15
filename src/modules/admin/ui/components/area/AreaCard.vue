<template>
  <v-sheet
    class="area-card pa-3 rounded-lg"
    color="#E8EAF6">
    <v-row
      no-gutters
      align="center">
      <v-col class="px-2">
        <span> {{ area.title }} </span>
      </v-col>

      <v-col class="d-flex justify-end align-center">
        <v-divider
          vertical
          class="mr-3" />

        <v-btn
          title="Переместить"
          class="handle"
          icon
          variant="text"
          size="small">
          <v-icon size="20"> mdi-arrow-all </v-icon>
        </v-btn>

        <v-btn
          title="Изменить"
          icon
          variant="text"
          size="small"
          @click="$emit('update')">
          <v-icon size="20"> mdi-pencil-outline </v-icon>
        </v-btn>

        <v-btn
          title="Удалить"
          icon
          variant="text"
          size="small"
          @click="$emit('delete')">
          <v-icon size="20"> mdi-delete-outline </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: 'AreaCard',

  props: {
    area: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.area-card {
  position: relative;
}

.vuedraggable-drag > .area-card {
  transform: rotate(2deg);
}

.vuedraggable-ghost > .area-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: rgb(230 230 230);
  content: '';
}
</style>
