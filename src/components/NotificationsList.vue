<template>
  <v-card class="mx-auto">
    <v-card-title class="no-bottom-padding card-with-actions">
      <div class="position-left">Recent notifications</div>
      <v-btn icon @click="markAllNotificationsAsRead">
        <v-icon>mdi-email-open-multiple</v-icon>
      </v-btn>
      <v-btn icon @click="deleteAllNotifications">
        <v-icon>mdi-notification-clear-all</v-icon>
      </v-btn>
    </v-card-title>
    <v-list three-line>
      <v-list-item-group>
        <template v-for="(notification, index) in notifications.slice().reverse()">
          <v-divider v-if="index === 0" :key="notification.id + 'upper-divider'"></v-divider>
          <v-list-item :key="notification.id + notification.title" @click="markAsRead(notification.id)">
            <template>
              <v-list-item-avatar>
                <v-icon :class="{ 'no-new-notification': notification.read }">mdi-new-box</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="notification.title"></v-list-item-title>
                <v-list-item-subtitle class="text--primary" v-text="notification.body"></v-list-item-subtitle>
                <v-list-item-subtitle v-text="formatNotificationDate(notification.timestamp)"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="deleteNotification(notification.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          <v-divider v-if="index + 1 < notifications.length" :key="notification.id + 'bottom-divider'"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
    <div class="text-center" v-if="notifications.length === 0">
      <v-icon x-large>mdi-bell-sleep</v-icon>
      <v-card-text>No notifications</v-card-text>
    </div>
  </v-card>
</template>

<style scoped>
.no-bottom-padding {
  padding-bottom: 0px;
}

.empty-state {
  flex-direction: column;
}

.notification-icon {
  padding-right: 5px;
}

.no-new-notification {
  visibility: hidden;
}

.card-with-actions {
  display: flex;
  justify-content: flex-end;
}

.position-left {
  margin-right: auto;
}
</style>

<script>
import { formatDistance } from 'date-fns';

export default {
  name: "NotificationsList",
  props: {
    notifications: Array,
  },
  methods: {
    deleteNotification(notificationId) {
      this.$store.dispatch(
        "deleteNotification",
        notificationId,
      );
    },
    markAsRead(notificationId) {
      this.$store.dispatch(
        "markNotificationAsRead",
        notificationId,
      );
    },
    markAllNotificationsAsRead() {
      this.$store.dispatch("markAllNotificationsAsRead");
    },
    deleteAllNotifications() {
      this.$store.dispatch("deleteAllNotifications");
    },
    formatNotificationDate(timestamp) {
      if(timestamp === '' || isNaN(timestamp)) {
        return '';
      }
      return formatDistance(new Date(Number(timestamp)), new Date(), { addSuffix: true });
    }
  },
};
</script>