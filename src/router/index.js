import Vue from 'vue'
import Router from 'vue-router'
import Llegadas from '@/components/llegadas'
import Saldo from '@/components/saldo'
import Recorridos from '@/components/recorridos'
import GoogleMaps from '@/components/google-maps'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'llegadas',
    path: '/',
    component: Llegadas
  },
  {
    name: 'recorridos',
    path: '/recorridos',
    component: Recorridos
  },
  {
    name: 'saldo',
    path: '/saldo',
    component: Saldo
  }, {
    name: 'buscar',
    path: '/buscar',
    component: GoogleMaps
  }

  ]
})
