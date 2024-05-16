import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
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
        class: 'backdrop border-b',
        density: 'compact',
      },
      VNavigationDrawer: {
        class: 'backdrop',
      },
      VList: {
        density: 'compact',
      },
    },
  })
  app.vueApp.use(vuetify)
})
