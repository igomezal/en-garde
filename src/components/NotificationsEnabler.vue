<template>
  <div>
    <v-alert
      :value="notificationsNotSupported()"
      type="warning"
      transition="scroll-y-transition"
      prominent
    >
      Sorry but your device doesn't support notifications.
    </v-alert>
    <v-card class="mx-auto">
      <v-card-title>Enable/Disable notifications</v-card-title>
      <v-card-text>
        <v-switch
          inset
          hide-details
          v-model="notifications"
          label="Receive notifications"
          :disabled="notificationsNotSupported() || !onlineStatus"
        ></v-switch>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import firebase from '@/utils/firebase-init.js';
import 'firebase/messaging';
import { mapState } from 'vuex';
import {
  askForPermissionToReceiveNotifications,
  deleteRegisteredToken,
  setPermissionForNotification,
  getPermissionForNotification,
} from '@/utils/push-notifications.js';

export default {
  name: 'NotificationEnabler',
  computed: {
    ...mapState(['onlineStatus']),
    notifications: {
      get() {
        return (
          !this.notificationsNotSupported() && getPermissionForNotification()
        );
      },
      set(notificationsValue) {
        if (notificationsValue) {
          askForPermissionToReceiveNotifications().then((token) =>
            this.$store.dispatch('updateNotificationToken', token || null)
          );
        } else {
          deleteRegisteredToken().then(() =>
            this.$store.dispatch('updateNotificationToken', null)
          );
        }
        return setPermissionForNotification(notificationsValue);
      },
    },
  },
  methods: {
    notificationsNotSupported() {
      return !firebase.messaging.isSupported();
    },
  },
};
</script>
