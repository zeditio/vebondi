

<template type="text/babel">
<v-bottom-nav :value="true" :active="activeTab" color="white">
  <v-btn flat color="primary" value="recorridos" href="/#/recorridos/" router>
    <span>Recorridos</span>
    <v-icon>directions</v-icon>
  </v-btn>
  <v-btn flat color="primary" value="llegadas" href="/#/" router>
    <span>LLegadas</span>
    <v-icon>directions_bus</v-icon>
  </v-btn>
  <v-btn flat color="primary" value="saldo" href="/#/saldo/" router>
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
    activeTab: function () {
      return this.$route.name
    }
  }
}
</script>
