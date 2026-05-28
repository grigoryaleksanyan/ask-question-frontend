import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
// eslint-disable-next-line camelcase
import { required, email, confirmed, max_value } from '@vee-validate/rules';

import type { DateRangeValue } from '@/shared/types';

export default {
  install: (app: {
    component: (name: string, component: unknown) => unknown;
  }) => {
    app
      .component('VeeForm', Form)
      .component('VeeField', Field)
      .component('VeeErrorMessage', ErrorMessage);

    configure({ validateOnInput: true });

    defineRule('email', email);
    defineRule('confirmed', confirmed);

    defineRule('required', (value: unknown) => {
      if (!required(value)) {
        return 'Обязательное поле';
      }

      return true;
    });

    defineRule('max_value', (value: unknown, [max]: [number]) => {
      if (!max_value(value, [max])) {
        return `Максимальное значение не должно превышать: ${max}`;
      }

      return true;
    });

    defineRule('required-date', (value: DateRangeValue) => {
      if (value.startDate === null && value.endDate === null) {
        return 'Обязательное поле';
      }

      return true;
    });
  },
};
