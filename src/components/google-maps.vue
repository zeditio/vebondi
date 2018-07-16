<style>

  .full-height {
    height: 100%
  }

  #floating-panel {
    position: absolute;
    bottom: 0px;
    width: 75%;
    left: 5%
  }

</style>

<template type="text/babel">

  <div class="full-height">
    <gmap-map ref="gmap" class="full-height" :center="center" :zoom="15"
              :options="{styles: styles, streetViewControl: false, fullscreenControl: false, disableDefaultUI: true}">
      <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true"
                   :draggable="false" :icon="m.icon" @click="showBusArrivalCard(m.busStop, m, index)">
      </gmap-marker>
    </gmap-map>
    <bus-arrival-card  id="floating-panel"
                       v-if="currentCard.isVisible"
                       :stop-code="currentCard.stopCode"
                       :lat="currentCard.lat"
                       :lng="currentCard.lng"
                       :buttons="buttons"/>
  </div>

</template>

<script>
// ///////////////////////////////////////
// New in 0.4
// https://github.com/xkjyeah/vue-google-maps/blob/HEAD/API.md
import BusStopsListByLine from '@/assets/bus-stops-by-line.json'
import busStopImage from '@/assets/bus.png'
import busStopImageSelected from '@/assets/bus-selected.png'
import BusArrivalCard from '@/components/bus-arrival-card'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyD0sdRX1gWoHkmCqjsefcaowUrdBtVj2p4'
  }
})
export default {
  props: {
    line: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      styles: [
        {
          'featureType': 'administrative',
          'elementType': 'geometry',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'poi',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'road',
          'elementType': 'labels.icon',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'transit',
          'stylers': [{
            'visibility': 'off'
          }]
        }],
      busStopsListByLine: [],
      icon: {
        url: busStopImage,
        size: {
          width: 15,
          height: 15,
          f: 'px',
          b: 'px'
        },
        animation: null
      },
      currentCard: {
        stopCode: 'C5643',
        busLines: [{
          line: 71,
          llegadas: ['Arribando', '10 min', '15 min']
        }],
        isVisible: false
      },
      buttons: ['close']
    }
  },
  methods: {
    loadMarkers: function () {
      // We have the problem that the screen freeze loading all markers, so we run the process after 1s
      let vm = this
      vm.$store.commit({
        type: 'showPageLoader'
      })
      // timeout para que carge el loeade
      setTimeout(function afterOneSeconds () {
        let currentBusStopsList
        for (let item of vm.busStopsListByLine) {
          if (item.key === vm.line) {
            currentBusStopsList = item.result.d
            break
          }
        }

        console.log('Cantidad de paradas:', currentBusStopsList.length)
        for (var i = 0; i < currentBusStopsList.length; i++) {
          var busStop = currentBusStopsList[i]
          var marker = {
            position: {
              lat: null,
              lng: null
            }
          }

          marker.position.lat = parseFloat(busStop.latitudParada)
          marker.position.lng = parseFloat(busStop.longitudParada)
          marker.busStop = busStop
          marker.icon = vm.icon
          vm.$store.commit({
            type: 'addMarker',
            marker: marker
          })
        }

        vm.$store.commit({
          type: 'hidePageLoader'
        })
      }, 2000)
    },
    showBusArrivalCard: function (busStop, marker, index) {
      this.currentCard.isVisible = false
      // busStop -1 is the marker of gelocation
      if (busStop === -1) {
        return
      }
      this.markers.splice(index, 1)
      let deppCopy = JSON.parse(JSON.stringify(marker))
      deppCopy.icon.url = busStopImageSelected
      this.$store.commit({
        type: 'addMarker',
        marker: deppCopy
      })

      this.currentCard.stopCode = busStop.identificadorParada
      this.currentCard.lat = busStop.latitudParada
      this.currentCard.lng = busStop.longitudParada
      this.currentCard.isVisible = true
    }
  },
  beforeMount: function () {
    this.$store.commit({
      type: 'removeAllMarkers'
    })
  },
  mounted: function () {
    this.busStopsListByLine = BusStopsListByLine
    this.loadMarkers()
  },
  computed: {
    center () {
      return this.$store.state.position
    },
    markers () {
      return this.$store.state.markers
    }

  },
  components: {
    BusArrivalCard
  }
}
</script>
