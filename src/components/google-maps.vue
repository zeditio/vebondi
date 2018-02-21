<style>
.full-height {
  height: 100%
}
#floating-panel {
  position: absolute;
  bottom: 56px;
  width: 75%;
  left: 5%
}
</style>

<template type="text/babel">
<div class="full-height">
  <gmap-map class="full-height" :center="center" :zoom="15" :options="{styles: styles, streetViewControl: false, fullscreenControl: false, disableDefaultUI: true}">
    <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="false" :icon="m.icon" @click="showBusArrivalCard(m.busStop, m, index)">
    </gmap-marker>
  </gmap-map>
  <bus-arrival-card id="floating-panel" :isVisible="currentCard.isVisible" :stop-code="currentCard.stopCode" :bus-lines="currentCard.busLines"  :buttons="buttons"/>
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
      markers: [],
      jsonFile: [],
      icon: {
        url: busStopImage,
        size: {
          width: 30,
          height: 30,
          f: 'px',
          b: 'px'
        },
        scaledSize: {
          width: 15,
          height: 15,
          f: 'px',
          b: 'px'
        }
      },
      currentCard: {
        stopCode: 'C5643',
        busLines: [{
          line: 71,
          llegadas: ['Arribando', '10 min', '15 min']
        }],
        isVisible: false
      },
      buttons: ['favorite', 'close']
    }
  },
  methods: {
    getMarkers: function () {
      for (var i = 0; i < this.jsonFile.length; i++) {
        var busStop = this.jsonFile[i]
        var marker = {
          position: {
            lat: null,
            lng: null
          }
        }
        marker.position.lat = busStop.lat
        marker.position.lng = busStop.lng
        marker.icon = this.icon
        marker.busStop = busStop
        this.markers.push(marker)
      }
    },
    showBusArrivalCard: function (busStop, marker, index) {
      this.markers.splice(index, 1)
      let deppCopy = JSON.parse(JSON.stringify(marker))
      deppCopy.icon.url = busStopImageSelected
      this.markers.push(deppCopy)
      this.currentCard.busLines = []
      this.currentCard.stopCode = busStop.stopCode
      this.currentCard.isVisible = true
    }
  },
  created: function () {
    this.jsonFile = JsonFile
    this.getMarkers()
  },
  computed: {
    showMarker: function () {
      // Call resizePreserveCenter() on all maps
      Vue.$gmapDefaultResizeBus.$emit('resize')
    },
    center () {
      return this.$store.state.pos
    }

  },
  components: {
    BusArrivalCard
  }
}
</script>
