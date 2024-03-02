<template>
  <ValidationObserver v-slot="{ valid, handleSubmit }">
    <CenterModalContentWrapper>
      <template #default>
        <template v-if="GET_USER_DATA.userRoleId == 2">
          <p><b>ФИО:</b> {{ GET_USER_DATA.userDetails.fullName }}</p>
          <p><b>Почта:</b> {{ GET_USER_DATA.userDetails.email }}</p>
          <p><b>Доп. инфо:</b> {{ GET_USER_DATA.userDetails.additionalInfo }}</p>
        </template>

        <p><b>Id:</b> {{ GET_USER_DATA.id }}</p>
        <p><b>Логин:</b> {{ GET_USER_DATA.login }}</p>
        <p><b>Роль:</b> {{ getUserStringRole }}</p>
        <p><b>Создан:</b> {{ new Date(GET_USER_DATA.сreated).toLocaleDateString() }}</p>
        <p><b>Изменен:</b> {{ GET_USER_DATA.updated ? new Date(GET_USER_DATA.updated).toLocaleDateString() : '-' }}</p>

        <template v-if="!showChangePassword">
          <v-btn
            class="mt-5"
            depressed
            small
            @click="showChangePassword = true">
            Изменить пароль
          </v-btn>
        </template>

        <div
          v-show="showChangePassword"
          class="mt-4">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required">
            <v-text-field
              v-model="controls.password"
              label="Старый пароль"
              dense
              outlined
              :error-messages="errors" />
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            vid="newPassword">
            <v-text-field
              v-model="controls.newPassword"
              label="Новый пароль"
              dense
              outlined
              :error-messages="errors" />
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            rules="required|confirmed:newPassword">
            <v-text-field
              v-model="controls.confirmPassword"
              label="Подтвердите новый пароль"
              dense
              outlined
              :error-messages="errors" />
          </ValidationProvider>
        </div>
      </template>
      <template #actions>
        <v-btn
          v-if="showChangePassword"
          :disabled="!valid"
          color="primary"
          class="white--text"
          @click="handleSubmit(onSubmit)">
          Сохранить
        </v-btn>
        <v-btn
          color="blue-grey"
          class="white--text"
          outlined
          @click="$emit('cancel')">
          Отмена
        </v-btn>
      </template>
    </CenterModalContentWrapper>
  </ValidationObserver>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import ALERT_TYPES from '@/modules/alert/constants/alert-types';
import { ChangePassword } from '../../../repositories/user-repository';

export default {
  name: 'UserProfile',

  data() {
    return {
      controls: {
        password: null,
        newPassword: null,
        confirmPassword: null,
      },

      showChangePassword: false,
    };
  },

  computed: {
    ...mapGetters('auth', ['GET_USER_DATA']),

    getUserStringRole() {
      if (this.GET_USER_DATA.userRoleId === 1) {
        return 'Администратор';
      }

      return 'Спикер';
    },
  },

  methods: {
    ...mapMutations('alert', ['ADD_ALERT']),
    ...mapMutations('preloader', ['ADD_LOADER', 'REMOVE_LOADER']),

    async onSubmit() {
      try {
        this.ADD_LOADER();

        await ChangePassword(this.controls);

        this.ADD_ALERT({ type: ALERT_TYPES.SUCCESS, text: 'Пароль успешно изменен' });

        this.$emit('success');
      } catch (error) {
        this.ADD_ALERT({ type: ALERT_TYPES.ERROR, text: error.message });
      } finally {
        this.REMOVE_LOADER();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
