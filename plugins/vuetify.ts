import '@/styles/main.scss'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'wotw',
      themes: {
        wotw: {
          dark: true,
          colors: {
            background: '#050e17',
            surface: '#1d242b',
            primary: '#7ec6f9',
            secondary: '#155ba2',
            accent: '#533ca6',
            accent2: '#d989d3',
            info: '#5199cd',
            warning: '#ff9800',
            error: '#dd2c00',
            success: '#00e676',
          },
        },
      },
    },
    defaults: {
      global: {
        ripple: {
          class: 'text-primary',
        },
      },
      VAppBar: {
        flat: true,
      },
      VList: {
        density: 'compact',
      },
    },
  })
  app.vueApp.use(vuetify)
})
