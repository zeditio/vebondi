

<template type="text/babel">
<v-bottom-nav :value="true" :active.sync="active" color="white">
  <v-btn flat color="pink" value="recorridos" href="/#/recorridos/" router>
    <span>Recorridos</span>
    <v-icon>directions</v-icon>
  </v-btn>
  <v-btn flat color="pink" value="favoritos" href="/#/favoritos/" router>
    <span>Favoritos</span>
    <v-icon>favorite</v-icon>
  </v-btn>
  <v-btn flat color="pink" value="saldo" href="/#/saldo/" router>
    <span>Saldo</span>
    <v-icon>attach_money</v-icon>
  </v-btn>
</v-bottom-nav>
</template>

<script>
export default {
  name: 'navbar',
  data () {
    return {}
  },
  computed: {
    active: function () {
      return this.$route.name
    },
    hidden: function () {
      if (this.$route.name === 'favoritos') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
