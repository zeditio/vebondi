

<template type="text/babel">

<div>
    <v-card height="100vh">
        <div>
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
    <h2>navbar</h2>
    </div>
</div>

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
