<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-switch v-model="enGarde" label="Availability" @click="updateAvailability"></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HomeView',

    data: () => ({
      enGarde: false,
    }),
    computed: {
      user() {
        return this.$store.state.user;
      },
    },
    methods: {
      updateAvailability() {
        const uid = this.user.uid;
        const db = window.firebase.firestore();

        db.doc(`users/${uid}`).set({
          availability: this.enGarde,
        })
          .then(() => console.log('Updated'))
          .catch((error) => console.error('Error updating db', error));
      }
    }
  }
</script>
