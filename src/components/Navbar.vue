<!-- https://medium.com/front-end-hacking/vue-js-mobile-navbar-using-vuetify-803856f00dfd -->
<template type="text/babel">

<v-card height="100vh">
    <router-view></router-view>
    <v-bottom-nav height="10vh" absolute :value="true" :active.sync="e1" color="transparent">
      <v-btn flat color="teal" value="fav" href="/fav" router>
        <span>Favoritos</span>
        <v-icon>favorite</v-icon>
      </v-btn>
      <v-btn flat color="cyan" value="arribos" href="/arribos" router>
        <span>Proximos</span>
        <v-icon>timer</v-icon>
      </v-btn>
      <v-btn flat color="green" value="saldo" href="/saldo" router>
        <span>Saldo</span>
        <v-icon>attach_money</v-icon>
      </v-btn>
    </v-bottom-nav>
</v-card>

</template>

<script>
export default {
  name: 'navbar',
  data () {
    return {
      e1: 'arribos'
    }
  }
}
</script>
