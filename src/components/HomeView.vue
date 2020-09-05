<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="without-padding">
        <v-alert
          :value="!loadingUserData && !telephone"
          type="warning"
          transition="scroll-y-transition"
          prominent>
          Please set your telephone number in the profile page.
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-card
          class="mx-auto"
        >
          <v-card-title>
            Set availability
          </v-card-title>
          <v-card-text class="normal-max-width">
            {{this.isAvailabilityCheckDisabled(this.telephone, this.dutyDays) ? 'You are not on-duty' : 'You are on-duty'}}
            <v-switch inset hide-details v-model="availability" label="Availability" :disabled="isAvailabilityCheckDisabled(this.telephone, this.dutyDays)"></v-switch>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="showMoreInfoAvailability = !showMoreInfoAvailability"
              aria-label="Show more info"
            >
              <v-icon>{{ showMoreInfoAvailability ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="showMoreInfoAvailability">
              <v-divider></v-divider>
                <v-card-text class="text-justify">
                  You can change your availability when you are on duty, this way when there is an incoming call whoever is available at that moment will have more priority (to receive the call) than someone who is not available.
                </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
          class="mx-auto"
        >
          <v-card-title>
            On duty calendar
          </v-card-title>
          <v-calendar
            :weekdays="[1,2,3,4,5,6,0]"
          >
          </v-calendar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .normal-max-width {
    max-width: 300px;
  }

  .without-padding {
    padding-top: 0px;
    padding-bottom: 0px;
  }
</style>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'HomeView',

    data: () => ({
      showMoreInfoAvailability: false,
    }),
    computed: {
      availability: {
        get() {
          return this.$store.getters.availability;
        },
        set(valueChecked) {
          this.$store.dispatch('updateAvailability', valueChecked);
        },
      },
      telephone: function() {
        return this.$store.getters.telephone;
      },
      ...mapState([
        'dutyDays', 'user', 'loadingUserData',
      ]),
    },
    methods: {
      isAvailabilityCheckDisabled(telephone, dutyDays) {
        if(telephone && Object.keys(dutyDays).length != 0) {
          const currentDutyDay = dutyDays[new Date().toISOString().split('T')[0]];
          return currentDutyDay ? !currentDutyDay.includes(this.user.uid) : true;
        }
        return true;
      }
    }
  }
</script>
