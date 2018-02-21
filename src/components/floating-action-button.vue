

<template type="text/babel">

<v-fab-transition>
    <v-btn fab bottom right color="accent" v-show="!hidden" @click="action" fixed style="bottom: 72px">
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
        this.$router.push({
          name: 'buscar'
        })
        return
      }
      if (this.$route.name === 'buscar') {
        console.log('gelocation')
        if (navigator.geolocation) {
          this.loading = true
          navigator.geolocation.getCurrentPosition(position => {
            console.log(position.coords.latitude, position.coords.longitude)
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            this.$store.commit({
              type: 'setMapPosition',
              pos: pos
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
