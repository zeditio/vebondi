

<template type="text/babel">

<v-fab-transition>
    <v-btn fab bottom right color="accent" v-show="!hidden" @click="action" fixed style="bottom: 72px">
        <v-icon>{{ this.icon}}</v-icon>
    </v-btn>
</v-fab-transition>

</template>

<script>
export default {
  name: 'fab',
  data () {
    return {}
  },
  methods: {
    action: function () {
      if (this.$route.name === 'llegadas') {
        this.$router.push({
          name: 'buscar'
        })
      }
    }
  },
  computed: {
    active: function () {
      return this.$route.name
    },
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
