<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-switch v-model="availability" label="Availability"></v-switch>
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
      user() {
        return this.$store.state.user;
      },
      availability: {
        get() {
          return this.$store.state.availability;
        },
        set(valueChecked) {
          const uid = this.user.uid;
          const db = window.firebase.firestore();

          db.doc(`users/${uid}`).set({
            availability: valueChecked,
          })
            .then(() => {
                this.$store.commit('updateAvailability', valueChecked);
            })
            .catch((error) => console.error('Error updating db', error));
        },
      },
    },
    methods: {

    }
  }
</script>
