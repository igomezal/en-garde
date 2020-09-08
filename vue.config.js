const appTitle = 'En Garde';

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = appTitle;
      return args;
    });
    config.plugin('preload').tap(() => {
      return [
        {
          rel: 'preload',
          fileWhitelist: [
            /.*authentication~dashboard~notifications~profile.*\.css/,
          ],
        },
      ];
    });
  },
  pwa: {
    name: appTitle,
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },
};