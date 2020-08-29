<template>
  <v-card class="mx-auto">
    <v-card-title>Enable/Disable notifications</v-card-title>
    <v-card-text>
      <v-switch inset hide-details v-model="notifications" label="Receive notifications"></v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
import { 
  askForPermissionToReceiveNotifications, 
  deleteRegisteredToken,
  setPermissionForNotification,
  getPermissionForNotification,
} from '../utils/push-notifications.js';

export default {
  name: "NotificationEnabler",
  data: () => ({
  }),
  computed: {
    notifications: {
      get() {
        return getPermissionForNotification();
      },
      set(notificationsValue) {
        if(notificationsValue) {
          askForPermissionToReceiveNotifications().then(token => this.$store.dispatch('updateNotificationToken', token));
        } else {
          deleteRegisteredToken().then(() => this.$store.dispatch('updateNotificationToken', null));
        }
        return setPermissionForNotification(notificationsValue);
      },
    },
  },
  methods: {},
};
</script>
