<!-- https://medium.com/front-end-hacking/vue-js-mobile-navbar-using-vuetify-803856f00dfd -->
<template type="text/babel">
<v-container fluid style="min-height: 0;" grid-list-lg>
  <v-layout row wrap>
    <v-flex xs12>
      <bus-arrival-card/>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import BusArrivalCard from '@/components/bus-arrival-card'

export default {
  name: 'saldo',
  components: {BusArrivalCard}
}
</script>
