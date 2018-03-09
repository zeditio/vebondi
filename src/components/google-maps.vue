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
    <gmap-map ref="gmap" class="full-height" :center="center" :zoom="15" :options="{styles: styles, streetViewControl: false, fullscreenControl: false, disableDefaultUI: true}">
        <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="false" :icon="m.icon" @click="showBusArrivalCard(m.busStop, m, index)">
        </gmap-marker>
    </gmap-map>
    <bus-arrival-card id="floating-panel" :isVisible="currentCard.isVisible" :stop-code="currentCard.stopCode" :buttons="buttons" />
</div>

</template>

<script>
// ///////////////////////////////////////
// New in 0.4
// https://github.com/xkjyeah/vue-google-maps/blob/HEAD/API.md
import JsonFile from '@/assets/bus-stops.json'
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
  data () {
    return {
      styles: [{
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
      jsonFile: [],
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
    getMarkers: function () {
      // We have the problem that the screen freeze loading all markers, so we run the process after 1s
      let vm = this
      // timeout para que carge el mapa
      setTimeout(function afterOneSeconds () {
        vm.$store.commit({
          type: 'showPageLoader'
        })
        // timeout para que carge el loeade
        setTimeout(function afterOneSeconds () {
          console.log('Cantidad de paradas:', vm.jsonFile.length)

          for (var i = 0; i < vm.jsonFile.length; i++) {
            var busStop = vm.jsonFile[i]
            var marker = {
              position: {
                lat: null,
                lng: null
              }
            }
            marker.position.lat = busStop.lat
            marker.position.lng = busStop.lng
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
      }, 2000)
    },
    showBusArrivalCard: function (busStop, marker, index) {
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
      this.currentCard.stopCode = busStop.stopCode
      this.currentCard.isVisible = true
    }
  },
  mounted: function () {
    this.jsonFile = JsonFile
    this.getMarkers()
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
