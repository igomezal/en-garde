import Vue from 'vue';
import Vuex from 'vuex';
import { addNotification, getAllNotifications, deleteAllNotifications, deleteNotification, updateNotification } from '../utils/store-indexddb';

Vue.use(Vuex);

const db = window.firebase.firestore();

const basicUserData = {
  availability: false,
  telephone: '',
};

const createNewUser = (uid) => db.doc(`users/${uid}`).set(basicUserData);

export default new Vuex.Store({
  state: {
    user: undefined,
    snackbar: {
      status: false,
      text: '',
    },
    dutyDays: {},
    loadingUserData: true,
    notifications: [],
  },
  mutations: {
    clearStore(state) {
      state = {
        user: undefined,
        snackbar: {
          status: false,
          text: '',
        },
        dutyDays: {},
        loadingUserData: true,
        notifications: [],
      };
      return state;
    },
    syncNotifications(state, notifications) {
      state.notifications = [...notifications];
    },
    addNotification(state, notification) {
      state.notifications.push({ ...notification, read: false });
    },
    deleteNotification(state, notificationId) {
      const indexToDelete = state.notifications.findIndex(notification => notification.id === notificationId);
      state.notifications.splice(indexToDelete, 1);
    },
    markNotificationAsRead(state, notificationId) {
      const indexToUpdate = state.notifications.findIndex(notification => notification.id === notificationId);
      state.notifications[indexToUpdate] = {
        ...state.notifications[indexToUpdate],
        read: true,
      };

      state.notifications = [...state.notifications];
    },
    markAllNotificationsAsRead(state) {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
    },
    deleteAllNotifications(state) {
      state.notifications = [];
    },
    startLoadingUserData(state) {
      state.loadingUserData = true;
    },
    finishLoadingUserData(state) {
      state.loadingUserData = false;
    },
    updateUser(state, user) {
      state.user = user;
    },
    processDutyDays(state, dutyDaysDoc) {
      state.dutyDays = dutyDaysDoc.docs.reduce(
        (accumulator, currentValue) => {
          accumulator[currentValue.id] = currentValue.data().users;
          return accumulator;
        },
        {}
      );
    },
    openSnackbar(state, snackbar) {
      state.snackbar = snackbar;
    },
    closeSnackbar(state) {
      state.snackbar.status = false;
    },
  },
  actions: {
    getUserInfo({ commit, state }) {
      const uid = state.user.uid;

      commit('startLoadingUserData');
      db.doc(`users/${uid}`)
        .get()
        .then((doc) => {
          const userData = doc.data();
          if (!userData) {
            createNewUser(uid)
              .then(() => {
                commit('updateUser', {
                  ...state.user,
                  ...basicUserData,
                });
                commit('finishLoadingUserData');
              })
              .catch((error) =>
                console.error('Error creating user', error)
              );
          } else {
            commit('updateUser', { ...state.user, ...doc.data() });
            commit('finishLoadingUserData');
          }
        })
        .catch((error) =>
          console.error('Error getting user data', error)
        );
    },
    getDutyDays({ commit }) {
      db.collection('dutyDays')
        .get()
        .then((docs) => {
          commit('processDutyDays', docs);
        })
        .catch((error) =>
          console.error('Error getting the dutyDays', error)
        );
    },
    updateAvailability({ commit, state }, valueChecked) {
      const uid = state.user.uid;

      db.doc(`users/${uid}`)
        .update({
          availability: valueChecked,
        })
        .then(() => {
          commit('updateUser', {
            ...state.user,
            availability: valueChecked,
          });
          const functions = window.firebase.functions();
          const notifyAvailabilityChanged = functions.httpsCallable(
            'notifyAvailabilityChanged'
          );
          notifyAvailabilityChanged({
            available: valueChecked,
          }).catch((error) =>
            console.error('Failed to send notification', error)
          );
        })
        .catch((error) => console.error('Error updating db', error));
    },
    updateTelephoneNumber({ commit, state }, telephone) {
      const uid = state.user.uid;

      db.doc(`users/${uid}`)
        .update({
          telephone,
        })
        .then(() => {
          commit('updateUser', { ...state.user, telephone });
          commit('openSnackbar', {
            status: true,
            text: 'Telephone updated correctly',
          });
        })
        .catch((error) => console.error('Error updating db', error));
    },
    updateNotificationToken({ state }, notificationToken) {
      const uid = state.user.uid;

      db.doc(`users/${uid}`)
        .update({
          notificationToken,
        })
        .catch((error) => console.error('Error updating db', error));
    },
    addNotification({ commit }, notification) {
      addNotification(notification).then((id) => {
        commit('addNotification', { ...notification, id, read: false });
      });
    },
    deleteNotification({ commit, state }, notificationId) {
      const notification = state.notifications.find(notification => notification.id === notificationId);
      if(notification) {
        deleteNotification(notificationId).then(() => {
          commit('deleteNotification', notificationId);
        });
      }
    },
    markNotificationAsRead({ commit, state }, notificationId) {
      const notification = state.notifications.find(notification => notification.id === notificationId);
      if(notification) {
        updateNotification({...notification, read: true }).then(() => {
          commit('markNotificationAsRead', notificationId);
        });
      }
    },
    markAllNotificationsAsRead({ commit, state }) {
      state.notifications.forEach(notification => {
        updateNotification({ ...notification, read: true });
      });
      commit('markAllNotificationsAsRead');
    },
    syncNotifications({ commit }) {
      getAllNotifications().then((notifications) => {
        commit('syncNotifications', notifications);
      });
    },
    deleteAllNotifications({ commit }) {
      deleteAllNotifications().then(() => {
        commit('deleteAllNotifications');
      })
    }
  },
  modules: {},
});
