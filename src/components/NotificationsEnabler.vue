<template>
  <v-card class="mx-auto">
    <v-card-title>Enable/Disable notifications</v-card-title>
    <v-card-text>
      <v-switch inset hide-details v-model="notifications" label="Receive notifications"></v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
import { askForPermissionToReceiveNotifications, deleteRegisteredToken } from '../utils/push-notifications.js';

export default {
  name: "NotificationEnabler",
  data: () => ({
  }),
  computed: {
    notifications: {
      get() {
        return JSON.parse(localStorage.getItem("notifications"));
      },
      set(notificationsValue) {
        if(notificationsValue) {
          askForPermissionToReceiveNotifications();
        } else {
          deleteRegisteredToken();
        }
        return localStorage.setItem("notifications", notificationsValue);
      },
    },
  },
  methods: {},
};
</script>
