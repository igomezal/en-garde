<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center" class="text-center">
      <v-col cols="12">
        <v-btn @click="onGoogleAuthentication" v-if="user === null">
            <v-icon left>mdi-google</v-icon> Sign in with Google
        </v-btn>
        <p v-else-if="user">You are authenticated!</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import firebase from '../utils/firebase-init.js';
  import 'firebase/auth';

  export default {
    name: 'AuthenticationPage',
    data: () => ({
    }),
    computed: {
      user() {
        return this.$store.state.user;
      },
    },
    methods: {
      onGoogleAuthentication: function() {
          const provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithRedirect(provider);
      },
    }
  }
</script>
