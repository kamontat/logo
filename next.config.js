const isDev = process.env.NODE_ENV === "development"

module.exports = {
  poweredByHeader: true,
  env: {
    buildtime: +new Date(),
  },
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: isDev ? "[path][name]__[local]" : "[hash:base64]",
  }
}
