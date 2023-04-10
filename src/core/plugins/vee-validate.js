import Vue from 'vue';
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
import { required, email, confirmed } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'Обязательное поле',
});

extend('email', {
  ...email,
  message: 'Введите корректную почту',
});

extend('confirmed', {
  ...confirmed,
  message: 'Значение должно совпадать',
});

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
