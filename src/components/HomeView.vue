<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-switch v-model="availability" label="Availability" :disabled="isAvailabilityCheckDisabled(this.telephone, this.dutyDays)"></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HomeView',

    data: () => ({
    }),
    computed: {
      availability: {
        get() {
          return this.$store.state.user ? this.$store.state.user.availability : false;
        },
        set(valueChecked) {
          this.$store.dispatch('updateAvailability', valueChecked);
        },
      },
      telephone: function() {
        return this.$store.state.user ? this.$store.state.user.telephone : undefined;
      },
      dutyDays: function() {
        return this.$store.state.dutyDays;
      }
    },
    methods: {
      isAvailabilityCheckDisabled(telephone, dutyDays) {
        if(telephone && Object.keys(dutyDays).length != 0) {
          return !telephone && dutyDays[new Date().toISOString().split('T')[0]].includes(this.user.uid);
        }
        return true;
      }
    }
  }
</script>
