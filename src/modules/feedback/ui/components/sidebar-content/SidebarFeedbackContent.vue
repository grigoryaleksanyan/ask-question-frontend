<template>
  <v-form
    ref="form"
    v-model="valid"
    class="ma-0 pa-0">
    <SidebarContentWrapper>
      <template #default>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :rules="rule"
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-select
            label="Причина"
            dense
            outlined
            :menu-props="{ bottom: true, offsetY: true }" />
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-model="disabledSuccess"
            label="Выключить кнопку 'Применить'"></v-checkbox>
        </v-col>
      </template>
      <template #footer>
        <v-btn
          class="mr-2"
          color="main-color"
          :disabled="disabledSuccess"
          @click="success">
          Принять
        </v-btn>
        <v-btn
          color="main-color"
          outlined
          @click="cancel">
          Отмена
        </v-btn>
      </template>
    </SidebarContentWrapper>
  </v-form>
</template>

<script>
export default {
  name: 'SidebarFeedbackContent',
  data() {
    return {
      disabledSuccess: false,
      valid: false,

      rule: [(v) => !!v || 'Обязательно'],
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },

    success() {
      this.validate();
      // this.$emit('success', { returnedData: 'success' });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
