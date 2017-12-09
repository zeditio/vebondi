

<template type="text/babel">
  <v-layout column>
      <v-flex xs12>
        <v-container fluid grid-list-md class="grey lighten-4">
          <v-layout row wrap>
            <v-flex xs12 md6>
              <bus-arrival-card/>
            </v-flex>
            <v-flex xs12 md6>
              <bus-arrival-card/>
            </v-flex>
            <v-flex xs12 md6>
              <bus-arrival-card/>
            </v-flex>
            <v-flex xs12 md6>
              <bus-arrival-card/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>

</template>

<script>
import BusArrivalCard from '@/components/bus-arrival-card'

export default {
  name: 'saldo',
  components: {
    BusArrivalCard
  }
}
</script>
