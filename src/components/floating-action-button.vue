

<template type="text/babel">

<v-fab-transition>
    <v-btn fab bottom right color="pink" v-show="!hidden" dark fixed style="bottom: 72px">
        <v-icon>add</v-icon>
    </v-btn>
</v-fab-transition>

</template>

<script>
export default {
  name: 'fab',
  data () {
    return {}
  },
  computed: {
    active: function () {
      return this.$route.name
    },
    hidden: function () {
      if (this.$route.name === 'favoritos') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
