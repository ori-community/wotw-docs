import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import seedLanguage from './grammars/seed'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    prerender: {
      routes: ['/docs/seedlang'],
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
      },
    },
    highlight: { langs: [seedLanguage], theme: 'dark-plus' },
  },
})
