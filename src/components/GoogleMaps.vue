<template>

<gmap-map :center="center" :zoom="15" style="height: 100vh;" :options="{styles: styles, streetViewControl: false}">
    <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :icon="m.icon"
        v-if=""
        @click=""
      ></gmap-marker>
    </gmap-map>
</template>

<script>

// ///////////////////////////////////////
// New in 0.4
// https://github.com/xkjyeah/vue-google-maps/blob/HEAD/API.md
import * as VueGoogleMaps from 'vue2-google-maps'
import axios from 'axios'
import Vue from 'vue'

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
      styles: [
        {
          'featureType': 'administrative',
          'elementType': 'geometry',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'poi',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'road',
          'elementType': 'labels.icon',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'transit',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        }
      ],
      markers: [],
      jsonFile: []
    }
  },
  methods: {
    getJsonFile: function () {
      axios.get(`/static/bus-stops.json`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.jsonFile = response.data
      this.getMarkers()
    })
    .catch(e => {
      this.errors.push(e)
    })
    },
    getMarkers: function () {
      var icon = {
        path: 'M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z',
        fillColor: '#00a665',
        scale: 0.5,
        fillOpacity: 1
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
