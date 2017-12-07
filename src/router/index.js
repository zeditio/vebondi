import Vue from 'vue'
import Router from 'vue-router'
import Favoritos from '@/components/Favoritos'
import Saldo from '@/components/Saldo'
import Recorridos from '@/components/Recorridos'
import Navbar from '@/components/Navbar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Navbar,
      redirect: '/favoritos',
      children: [
        {
          name: 'favoritos',
          path: 'favoritos',
          component: Favoritos
        },
        {
          name: 'recorridos',
          path: 'recorridos',
          component: Recorridos
        },
        {
          name: 'saldo',
          path: 'saldo',
          component: Saldo
        }

      ]
    }
  ]
})
