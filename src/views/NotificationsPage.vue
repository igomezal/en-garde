<template>
  <div class="notifications">
    <v-container>
      <v-row>
        <v-col cols="12">            
          <NotificationsEnabler/>
        </v-col>
        <v-col cols="12">            
          <NotificationsList :notifications="notifications"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import NotificationsEnabler from '../components/NotificationsEnabler';
import NotificationsList from '../components/NotificationsList';

export default {
  name: 'Notifications',
  components: {
    NotificationsEnabler,
    NotificationsList,
  },
  computed: {
    notifications() {
      return this.$store.state.notifications;
    }
  }
}
</script>