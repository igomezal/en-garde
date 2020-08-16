<template>
  <v-app>
    <v-app-bar
      app
      color="background-app-bar"
    >
      <v-btn icon @click="goBack" v-if="showBackButton()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>{{pageTitle}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="user" icon @click="goToProfilePage">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn v-if="user" icon @click="goToNotificationsPage">
          <v-badge
            color="green"
            :content="newNotifications"
            :value="newNotifications"
            overlap
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
      </v-btn>
      <v-menu
        left
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click="changeTheme"
          >
            <v-list-item-title>Change to {{this.$vuetify.theme.dark ? 'light'  : 'dark'}} theme</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="goToAboutPage"
          >
            <v-list-item-title>About it</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-snackbar
        color="snackbar-background-color"
        v-model="snackbar.status"
        elevation="24"
      >
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="snackbar-action-color"
            text
            v-bind="attrs"
            @click="closeSnackbar"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

    <v-main class="main">
      <transition name="router-anim" enter-active-class="animate__animated animate__fadeIn">
        <router-view></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<style src="intl-tel-input/build/css/intlTelInput.min.css">
</style>

<style src="animate.css/animate.min.css">
</style>

<style>
  .v-snack__content {
    color: var(--v-snackbar-text-color-base);
  }

  .v-snack__wrapper {
    min-width: auto !important;
  }

  .main {
    background-color: var(--v-background-base);
  }
</style>

<script>
import {
  messaging,
  getPermissionForNotification,
  askForPermissionToReceiveNotifications,
} from './utils/push-notifications.js';

export default {
  name: 'App',
  data: () => ({
    applicationName: 'En Garde',
  }),
  computed: {
    pageTitle: function() {
      return this.$route.name === 'Login' ? this.applicationName : this.$route.name;
    },
    user: function() {
      return this.$store.state.user;
    },
    snackbar: function() {
      return this.$store.state.snackbar;
    },
    newNotifications: function() {
      return this.$store.state.notifications.filter((notification) => !notification.read).length;
    },
  },
  watch: {
    $route: {
      handler: function(to) {
        document.title = `${this.applicationName} - ${to.name}`;
        if(!['Login', 'About'].includes(to.name))
          this.checkPermissions();
        if(to.name === 'Login' && this.user) {
          this.$router.push({ name: 'Dashboard' });
        }
      },
      immediate: true,
    },
  },
  beforeCreate: function() {
    const storedDarkTheme = JSON.parse(localStorage.getItem('darkTheme'));
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && storedDarkTheme === null) { // Dark mode base on device settings
      this.$vuetify.theme.dark = true;
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if(event.matches) {
          this.$vuetify.theme.dark = true;
        } else {
          this.$vuetify.theme.dark = false;
        }
      });
    } else { // Dark mode base on user selection
      this.$vuetify.theme.dark = storedDarkTheme === null ? false : storedDarkTheme;
    }

    window.firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.commit('updateUser', user);
        this.$store.dispatch('getUserInfo');
        this.$store.dispatch('getDutyDays');

        if(getPermissionForNotification()) {
          askForPermissionToReceiveNotifications()
            .then(token => this.$store.dispatch('updateNotificationToken', token));
        }

        messaging.onMessage((payload) => {
          // Get notifications when app is opened
          this.$store.commit('addNotification', payload.notification);
        });

        messaging.onTokenRefresh(() => {
          askForPermissionToReceiveNotifications()
            .then(token => this.$store.dispatch('updateNotificationToken', token));
        });

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
    showBackButton() {
      return !['Dashboard', 'Login', null].includes(this.$route.name);
    },
    goBack() {
      this.$router.goBack();
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem('darkTheme', this.$vuetify.theme.dark);
    },
    goToAboutPage() {
      if(this.$router.currentRoute.name !== 'About') {
        this.$router.push({ name: 'About' });
      }
    },
    goToProfilePage() {
      if(this.$router.currentRoute.name !== 'Profile') {
        this.$router.push({ name: 'Profile' });
      }
    },
    goToNotificationsPage() {
      if(this.$router.currentRoute.name !== 'Notifications') {
        this.$router.push({ name: 'Notifications' });
      }
    },
    checkPermissions() {
      if(this.user === null) {
        this.$router.push({ name: 'Login' });
      }
    },
    closeSnackbar() {
      this.$store.commit('closeSnackbar');
    }
  }
};
</script>
