

<template type="text/babel">
  <v-layout column>
      <v-flex xs12>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <template v-for="(arrival, i) in myArrivals">
              <bus-arrival-card :card-name="arrival.cardName" :stop-code="arrival.stopCode" :bus-lines="arrival.busLines" :buttons="buttons"/>
</template>
          </v-layout>
        </v-container>
      </v-flex>
  </v-layout>

</template>

<script>
import BusArrivalCard from '@/components/bus-arrival-card'

export default {
  name: 'llegadas',
  data () {
    return {
      myArrivals: [
        {
          cardName: 'casa al trabajo',
          stopCode: 'C5643',
          busLines: [{
            line: 71,
            llegadas: ['Arribando', '10 min', '15 min']
          }]
        }
      ],
      buttons: ['refresh']
    }
  },
  components: {
    BusArrivalCard
  }
}
</script>
