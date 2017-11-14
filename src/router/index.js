import Vue from 'vue'
import Router from 'vue-router'
import GoogleMaps from '@/components/GoogleMaps'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoogleMaps',
      component: GoogleMaps
    }
  ]
})
