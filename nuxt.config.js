const pkg = require('./package')

module.exports = {
  mode: 'universal',
  modern: 'client',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      {
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
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
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
  css: ['~/assets/styles/font.scss', '~/assets/styles/bulma.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/google-analytics', 'nuxt-fontawesome'],

  'google-analytics': {
    id: 'UA-124896160-6'
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  fontawesome: {
    component: 'fa',
    imports: [
      //import whole set
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      },
      {
        set: '@fortawesome/free-regular-svg-icons',
        icons: ['far']
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['fab']
      }
    ]
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
    extend(config, { isDev, isClient, loaders }) {
      if (isDev) loaders.cssModules.localIdentName = '[name]_[local]'
      else
        loaders.cssModules.localIdentName =
          'kcnt__[name]_[contenthash:base64:18]'

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
