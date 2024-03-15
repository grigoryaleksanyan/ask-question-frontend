<template>
  <v-card
    elevation="2"
    color="#E8EAF6">
    <v-card-title class="py-2">
      <v-row
        no-gutters
        class="text-body-1">
        <v-col
          cols="12"
          align-self="center">
          <span style="word-break: break-word">Имя: {{ feedback.username }}</span>
          <br />
          <span style="word-break: break-word">Почта: {{ feedback.email }}</span>
        </v-col>
        <v-col
          class="d-flex justify-start justify-sm-end"
          cols="12"
          sm="6">
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <div class="d-flex">
        <v-sheet
          style="overflow-y: scroll"
          color="white"
          max-height="200px"
          width="100%"
          class="pa-3">
          <div>
            <p>
              {{ feedback.theme }}
            </p>
            <p class="font-italic">
              {{ feedback.text }}
            </p>
          </div>
        </v-sheet>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="py-1">
      <v-container
        fluid
        class="py-0">
        <v-row
          no-gutters
          align="center">
          <v-col>
            <span class="text-caption"> Создана: {{ new Date(feedback.сreated).toLocaleDateString() }} </span>
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-btn
              title="Удалить"
              icon
              variant="text"
              size="small"
              @click="$emit('delete')">
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'FeedbackCard',

  props: {
    feedback: {
      type: Object,
      required: true,
    },
  },
};
</script>
