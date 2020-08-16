<template>
  <v-card
    class="mx-auto"
  >
    <v-card-title class="no-bottom-padding">Recent notifications</v-card-title>
    <v-list three-line>
      <v-list-item-group>
        <template v-for="(notification, index) in notifications.slice().reverse()">
          <v-divider v-if="index === 0" :key="index + 'upper-divider'"></v-divider>
          <v-list-item :key="index + notification.title" @click="markAsRead(index)">
            <template>
              <v-list-item-avatar>
                <v-icon
                  :class="{ 'no-new-notification': notification.read }"
                >
                  mdi-new-box
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="notification.title"></v-list-item-title>
                <v-list-item-subtitle class="text--primary" v-text="notification.body"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  icon
                  @click="deleteNotification(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          <v-divider v-if="index + 1 < notifications.length" :key="index + 'bottom-divider'"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
    <div class="text-center" v-if="notifications.length === 0">
      <v-icon
        x-large
      >
        mdi-bell-sleep
      </v-icon>
      <v-card-text>
        No notifications
      </v-card-text>
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
</style>

<script>
export default {
  name: "NotificationsList",
  props: {
    notifications: Array,
  },
  methods: {
    deleteNotification(notificationId) {
      this.$store.commit('deleteNotification', this.notifications.length - 1 - notificationId);
    },
    markAsRead(notificationId) {
      this.$store.commit('markNotificationAsRead', this.notifications.length - 1 - notificationId)
    } 
  }
};
</script>