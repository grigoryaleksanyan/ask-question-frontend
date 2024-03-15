import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
// eslint-disable-next-line camelcase
import { required, email, confirmed, max_value } from '@vee-validate/rules';

export default {
  install: (app) => {
    app.component('VeeForm', Form).component('VeeField', Field).component('VeeErrorMessage', ErrorMessage);

    configure({
      validateOnInput: true,
    });

    // использование стандартных правил
    defineRule('email', email);
    defineRule('confirmed', confirmed);
    // стандартное правило с переопределением сообщения ошибки
    defineRule('required', (value) => {
      if (!required(value)) {
        return 'Обязательное поле';
      }

      return true;
    });

    // стандартное правило с отображение аргумента в сообщении
    defineRule('max_value', (value, [max]) => {
      if (!max_value(value, [max])) {
        return `Максимальное значение не должно превышать: ${max}`;
      }

      return true;
    });

    // собственное правило
    defineRule('required-date', ({ startDate, endDate }) => {
      if (startDate === null && endDate === null) {
        return 'Обязательное поле';
      }

      return true;
    });
  },
};
