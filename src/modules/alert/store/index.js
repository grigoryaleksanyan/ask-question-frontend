import generateId from '../helpers/pseudorandom-generator';

export default {
  namespaced: true,

  state: () => ({
    alerts: [],
  }),

  mutations: {
    ADD_ALERT(state, { type, text, delay }) {
      const alert = {
        id: generateId(),
        type,
        text,
        delay,
      };

      state.alerts.push(alert);

      if (alert.type !== 'error') {
        setTimeout(() => {
          state.alerts = state.alerts.filter((el) => el.id !== alert.id);
        }, alert.delay ?? 3000);
      }
    },

    REMOVE_ALERT(state, id) {
      state.alerts = state.alerts.filter((alert) => alert.id !== id);
    },
  },

  getters: {
    GET_ALERTS: (state) => state.alerts,
  },
};
