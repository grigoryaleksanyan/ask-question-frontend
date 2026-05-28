<template>
  <v-container
    style="max-width: 1200px"
    class="text-left pa-5 mx-auto"
    fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h1 class="text-headline-small text-sm-headline-medium">Спикеры</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              size="small"
              color="blue-grey">
              Добавить спикера
              <v-icon
                end
                theme="dark">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineOptions({ name: 'AdminSpeakersPage' });
</script>
