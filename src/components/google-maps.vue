<style>

#googleMaps {
    height: 91%;
}

</style>

<template type="text/babel">

<gmap-map id="googleMaps" :center="center" :zoom="15" :options="{styles: styles, streetViewControl: false}">
    <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="false" :icon="m.icon" v-if="" @click="">
    </gmap-marker>
</gmap-map>

</template>

<script>
// ///////////////////////////////////////
// New in 0.4
// https://github.com/xkjyeah/vue-google-maps/blob/HEAD/API.md
import JsonFile from '@/assets/bus-stops.json'
import busStopImage from '@/assets/bus.png'
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
      center: {
        lat: -31.4206274,
        lng: -64.1908597
      },
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
      jsonFile: []
    }
  },
  methods: {
    getJsonFile: function () {
      this.jsonFile = JsonFile
      console.log('getJsonFile', this.jsonFile)
      this.getMarkers()
    },
    getMarkers: function () {
      var icon = {
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
      }
      for (var i = 0; i < this.jsonFile.length; i++) {
        var busStop = this.jsonFile[i]
        var marker = {
          position: {
            lat: 0,
            lng: 0
          }
        }
        marker.position.lat = busStop.lat
        marker.position.lng = busStop.lng
        marker.icon = icon
        this.markers.push(marker)
      }
    }
  },
  mounted: function () {
    let vm = this
    vm.getJsonFile()
  },
  watch: {
    '$route' (to, from) {
      // Call resizePreserveCenter() on all maps
      Vue.$gmapDefaultResizeBus.$emit('resize')
    }
  },
  computed: {
    showMarker: function () {
      // Call resizePreserveCenter() on all maps
      Vue.$gmapDefaultResizeBus.$emit('resize')
    }
  }
}
</script>
