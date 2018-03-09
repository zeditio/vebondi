import Vue from 'vue'
import Router from 'vue-router'
import Llegadas from '@/components/llegadas'
import GoogleMaps from '@/components/google-maps'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'llegadas',
    path: '/',
    component: Llegadas
  },
  {
    name: 'buscar',
    path: '/buscar',
    component: GoogleMaps
  }

  ]
})
