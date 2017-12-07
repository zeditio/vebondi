import Vue from 'vue'
import Router from 'vue-router'
import GoogleMaps from '@/components/GoogleMaps'
import Favoritos from '@/components/Favoritos'
import Navbar from '@/components/Navbar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: 'home',
      component: Navbar,
      children: [
        {
          name: 'fav',
          path: 'fav',
          component: Favoritos
        },
        {
          name: 'arribos',
          path: 'arribos',
          component: GoogleMaps
        }

      ]
    }
  ]
})
