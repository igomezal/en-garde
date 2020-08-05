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
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
  beforeCreate: function() {
    window.firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.commit('updateUser', user);
        this.$store.dispatch('getAvailability');
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
};
</script>
