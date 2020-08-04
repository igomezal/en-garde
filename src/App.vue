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
        this.user = user; // store it with vue store
        if(this.$router.currentRoute.name === 'Login') {
          this.$router.push({ name: 'Dashboard' });
        }
      } else {
        this.user = null; // store it with vue store
        if(this.$router.currentRoute.name !== 'Login') {
          this.$router.push({ name: 'Login' });
        }
      }
    });
  },
};
</script>
