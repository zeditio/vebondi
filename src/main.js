// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import store from './store'
import colors from 'vuetify/es5/util/colors'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import('../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader

Vue.use(Vuetify, {
  theme: {
    primary: colors.pink.darken1,
    secondary: colors.pink.lighten1,
    accent: colors.pink.accent1,
    error: '#b71c1c'
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
