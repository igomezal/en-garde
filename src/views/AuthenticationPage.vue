<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center" class="text-center">
      <v-col cols="12">
        <v-btn @click="onGoogleAuthentication" v-if="user === null">
            <v-icon left>{{ mdiGoogle }}</v-icon> Sign in with Google
        </v-btn>
        <p v-else-if="user">You are authenticated!</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mdiGoogle } from '@mdi/js';
  export default {
    name: 'AuthenticationPage',
    data: () => ({
        mdiGoogle,
    }),
    computed: {
      user() {
        return this.$store.state.user;
      },
    },
    methods: {
      onGoogleAuthentication: function() {
          const provider = new window.firebase.auth.GoogleAuthProvider();
          window.firebase.auth().signInWithRedirect(provider);
      },
    }
  }
</script>
