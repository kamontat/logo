const pkg = require('./package')

module.exports = {
  mode: 'universal',
  modern: 'client',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Logo',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      },
      {
        hid: 'version',
        name: 'version',
        content: pkg.version
      },
      {
        hid: 'author',
        name: 'author',
        content: pkg.author
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: ['~/assets/styles/font', '~/assets/styles/bulma'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/clipboard.js'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/gtm-module#setup
    '@nuxtjs/gtm'
  ],

  env: {
    FULLPATH: process.env.NODE_ENV === 'development' ?
      'http://localhost:3000' :
      'https://logo.kamontat.net'
  },

  gtm: {
    dev: true,

    id: 'GTM-TNXHV84',
    layer: 'dataLayer',
    variables: {},

    pageTracking: true,
    pageViewEventName: 'nuxtRoute',

    autoInit: true,
    respectDoNotTrack: false,

    scriptId: 'gtm-script',
    scriptDefer: false,
    scriptURL: 'https://www.googletagmanager.com/gtm.js',

    noscript: true,
    noscriptId: 'gtm-noscript',
    noscriptURL: 'https://www.googletagmanager.com/ns.html'
  },

  generate: {
    fallback: '404.html'
  },

  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, {
      isDev,
      isClient,
      loaders
    }) {
      if (isDev) loaders.cssModules.localIdentName = '[name]_[local]'
      else loaders.cssModules.localIdentName = 'logo_[contenthash:base64:18]'

      config.node = {
        fs: 'empty'
      }

      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
