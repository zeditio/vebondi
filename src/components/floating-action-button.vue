

<template type="text/babel">

<v-fab-transition>
    <v-btn fab bottom right color="accent" v-show="!hidden" @click="action" fixed style="bottom: 16px">
        <v-icon v-show="!loading" > {{ this.icon}} </v-icon>
        <v-progress-circular indeterminate color="primary" v-show="loading"></v-progress-circular>
    </v-btn>
</v-fab-transition>

</template>

<script>
export default {
  name: 'fab',
  data () {
    return {
      loading: false
    }
  },
  methods: {
    action: function () {
      if (this.$route.name === 'llegadas') {
        this.$ga.event({
          eventCategory: 'float_action_button',
          eventAction: 'search'
        })

        this.$router.push({
          name: 'selecionarLinea'
        })
        return
      }
      if (this.$route.name === 'buscar') {
        // if the map is loading, disable geolocation button
        if (this.$store.state.showPageLoader === true) {
          return
        }
        this.$ga.event({
          eventCategory: 'float_action_button',
          eventAction: 'geolocation'
        })
        if (navigator.geolocation) {
          this.loading = true
          navigator.geolocation.getCurrentPosition(pos => {
            console.log(pos.coords.latitude, pos.coords.longitude)
            var position = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            }
            this.$store.commit({
              type: 'setMapPosition',
              position: position
            })

            var marker = {
              position: position,
              busStop: -1
            }
            this.$store.commit({
              type: 'addMarker',
              marker: marker
            })

            this.loading = false
          })
        }
      }
    }
  },
  computed: {
    hidden: function () {
      if (this.$route.name === 'llegadas') {
        return false
      }
      if (this.$route.name === 'buscar') {
        return false
      }
      return true
    },
    icon: function () {
      if (this.$route.name === 'llegadas') {
        return 'search'
      }
      if (this.$route.name === 'buscar') {
        return 'my_location'
      }
      return true
    }
  }
}
</script>
