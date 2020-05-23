const withCSS = require('@zeit/next-css')

const isDev = process.env.NODE_ENV === "development"
module.exports = withCSS({
  poweredByHeader: false,
  env: {
    buildtime: +new Date(),
  },
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: isDev ? "[path][name]__[local]" : "[hash:base64]",
  }
})