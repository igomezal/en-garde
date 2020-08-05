import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: undefined,
    availability: false,
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    updateAvailability(state, availability) {
      state.availability = availability;
    }
  },
  actions: {
    getAvailability({ commit, state }) {
      const uid = state.user.uid;
      const db = window.firebase.firestore();

      db.doc(`users/${uid}`).get()
        .then((doc) => {
          commit('updateAvailability',  doc.data().availability)
        })
        .catch((error) => console.error('Error getting availability', error));
    },
  },
  modules: {
  }
})
