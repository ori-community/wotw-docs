import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import seedLanguage from './grammars/seed'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    prerender: {
      routes: ['/docs/seedlang', '/docs/quest-states'],
    },
  },
  modules: [
    '@nuxt/content',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    build: {
      cssCodeSplit: false,
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  content: {
    markdown: {
      toc: {
        searchDepth: 1,
      },
      remarkPlugins: {
        'remark-orimoji': {},
        'remark-heading-id': {},
      },
    },
    highlight: { langs: [seedLanguage], theme: 'dark-plus' },
  },
})
