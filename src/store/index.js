import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const db = window.firebase.firestore();

export default new Vuex.Store({
  state: {
    user: undefined,
    snackbar: {
      status: false,
      text: '',
    },
    dutyDays: {},
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    processDutyDays(state, dutyDaysDoc) {
      state.dutyDays = dutyDaysDoc.docs.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id] = currentValue.data().users;
        return accumulator;
      }, {});
    },
    openSnackbar(state, snackbar) {
      state.snackbar = snackbar;
    },
    closeSnackbar(state) {
      state.snackbar.status = false;
    }
  },
  actions: {
    getUserInfo({ commit, state }) {
      const uid = state.user.uid;

      db.doc(`users/${uid}`).get()
        .then((doc) => {
          commit('updateUser',  { ...state.user, ...doc.data() });
        })
        .catch((error) => console.error('Error getting user data', error));
    },
    getDutyDays({ commit }) {
      db.collection('dutyDays').get()
        .then((docs) => {
          commit('processDutyDays', docs);
        })
        .catch((error) => console.error('Error getting the dutyDays', error));
    },
    updateAvailability({ commit, state }, valueChecked) {
      const uid = state.user.uid;

      db.doc(`users/${uid}`).update({
        availability: valueChecked,
      })
        .then(() => {
          commit('updateUser', { ...state.user, availability: valueChecked });
        })
        .catch((error) => console.error('Error updating db', error));
    },
    updateTelephoneNumber({ commit, state }, telephone) {
      const uid = state.user.uid;

      db.doc(`users/${uid}`).update({
        telephone,
      })
        .then(() => {
          commit('updateUser', { ...state.user, telephone });
          commit('openSnackbar', { status: true, text: 'Telephone updated correctly' });
        })
        .catch((error) => console.error('Error updating db', error));
    },
  },
  modules: {
  }
})
