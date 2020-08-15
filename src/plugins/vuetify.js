import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import minifyTheme from 'minify-css-string';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        background: '#f7f7f8',
        'background-app-bar': '#ffffff',
        'snackbar-background-color': '#323232',
        'snackbar-text-color': '#bdbdbd',
        'snackbar-action-color': '#9c71d0',
      },
      dark: {
        background: '#121212',
        primary: "#ffffff",
        error: "#ff5252",
        'background-app-bar': '#18181b',
        'snackbar-background-color': '#ffffff',
        'snackbar-text-color': '#121212',
        'snackbar-action-color': '#3700B3',
      },
    },
    options: {
      customProperties: true,
      minifyTheme,
    },
  }
});
