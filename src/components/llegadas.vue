

<template type="text/babel">
  <v-layout column>
      <v-flex xs12>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <template v-for="(arrival, i) in myArrivals">
              <bus-arrival-card
              :card-name="arrival.cardName"
              :stop-code="arrival.stopCode"
              :bus-lines="arrival.busLines"
              :buttons="buttons"
              isVisible
              @deleteCard="deleteCard"/>
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
      buttons: ['delete', 'refresh']
    }
  },
  methods: {
    getSavedCards: function () {
      let savedCards = localStorage.getItem('savedCards')
      if (savedCards === null) {
        savedCards = []
      } else {
        savedCards = JSON.parse(savedCards)
      }
      this.myArrivals = savedCards
    },
    deleteCard: function (stopCode) {
      for (var i = 0; i < this.myArrivals.length; i++) {
        if (this.myArrivals[i].stopCode === stopCode) {
          this.myArrivals.splice(i, 1)
          return
        }
      }
    }
  },
  mounted: function () {
    this.getSavedCards()
  },
  components: {
    BusArrivalCard
  }
}
</script>
