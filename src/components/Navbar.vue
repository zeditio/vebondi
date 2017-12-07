

<template type="text/babel">

<div>
    <v-card height="100vh">
        <router-view></router-view>
        <v-fab-transition>
            <v-btn fab color="pink" style="margin-left: 80vw; margin-top: 75vh;">
                <v-icon color="white">add</v-icon>
            </v-btn>
        </v-fab-transition>
        <v-bottom-nav height="10vh" absolute :value="true" :active.sync="active" color="transparent">
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
    </v-card>
</div>

</template>

<script>
export default {
  name: 'navbar',
  data () {
    return {
    }
  },
  computed: {
    active: function () {
      return this.$route.name
    }
  }
}
</script>
