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
import NotificationsEnabler from '@/components/NotificationsEnabler';
import NotificationsList from '@/components/NotificationsList';

import { mapState } from 'vuex';

export default {
  name: 'Notifications',
  components: {
    NotificationsEnabler,
    NotificationsList,
  },
  computed: mapState([
    'notifications',
  ]),
}
</script>