<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn v-if="user" icon @click="goToProfilePage">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-snackbar
        color="success"
        v-model="snackbar.status"
        absolute
      >
        {{ snackbar.text }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="closeSnackbar"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style src="intl-tel-input/build/css/intlTelInput.min.css">

</style>

<style>
  .v-snack__wrapper {
    min-width: auto !important;
  }
</style>

<script>
export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
  computed: {
    user: function() {
      return this.$store.state.user;
    },
    snackbar: function() {
      return this.$store.state.snackbar;
    },
  },
  beforeCreate: function() {
    window.firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.commit('updateUser', user);
        this.$store.dispatch('getUserInfo');
        this.$store.dispatch('getDutyDays');
        if(this.$router.currentRoute.name === 'Login') {
          this.$router.push({ name: 'Dashboard' });
        }
      } else {
        this.$store.commit('updateUser', null);
        if(this.$router.currentRoute.name !== 'Login') {
          this.$router.push({ name: 'Login' });
        }
      }
    });
  },
  methods: {
    goToProfilePage() {
      if(this.$router.currentRoute.name !== 'Profile') {
        this.$router.push({ name: 'Profile' });
      }
    },
    closeSnackbar() {
      this.$store.commit('closeSnackbar');
    }
  }
};
</script>
