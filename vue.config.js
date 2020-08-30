module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'En Garde';
        return args;
      });
    config.plugin("preload")
      .tap(() => {
        return [{
          rel: "preload",
          include: "allAssets",
          fileWhitelist: [/.*\.css/, /.*\.js/, /.*\.woff2$/],
          fileBlacklist: [/\.map$/, /hot-update\.js$/]
        }];
      });
  },
}