<template>
  <v-app>
    <v-app-bar
      app
      color="background-app-bar"
    >
      <v-btn icon @click="goBack" v-if="showBackButton()" aria-label="Go Back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title><h1>{{pageTitle}}</h1></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="user" icon @click="goToProfilePage" aria-label="Profile">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn v-if="user" icon @click="goToNotificationsPage" aria-label="Notifications">
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
        role="menu"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            aria-label="Options"
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
          <v-divider v-if="user"></v-divider>
          <v-list-item
            v-if="user"
            @click="signOut"
          >
            <v-list-item-title>Sign Out</v-list-item-title>
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

<style>
  .v-toolbar__title h1 {
    font-size: 1.25rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: normal;
    padding: 0;
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }
  .v-snack__content {
    color: var(--v-snackbar-text-color-base);
  }

  .v-snack__wrapper {
    min-width: auto !important;
  }

  .main {
    background-color: var(--v-background-base);
  }

  /* animate-css styles to not load the whole library */
  :root {
    --animate-duration: 1s;
    --animate-delay: 1s;
    --animate-repeat: 1;
  }

  .animate__animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-duration: var(--animate-duration);
    animation-duration: var(--animate-duration);
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  /* Fading entrances  */
  @-webkit-keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
  .animate__fadeIn {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
  }
</style>

<script>
import {
  messaging,
  deleteRegisteredToken,
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
        this.$store.dispatch('syncNotifications');

        document.addEventListener('visibilitychange', () => {
          if(!document.hidden) {
            this.$store.dispatch('syncNotifications');
          }
        });
        
        if(getPermissionForNotification()) {
          askForPermissionToReceiveNotifications()
            .then(token => this.$store.dispatch('updateNotificationToken', token));
        }
        
        messaging.onMessage((payload) => {
          // Get notifications when app is opened
          this.$store.dispatch('addNotification', { ...payload.notification, timestamp: payload.data.timestamp });
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
    },
    signOut() {
      window.firebase.auth().signOut();
      deleteRegisteredToken();
      this.$store.dispatch('deleteAllNotifications');
      this.$store.commit('clearStore');
    },
  }
};
</script>
