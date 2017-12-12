<style>

.pull-right {
    float: right;
}


</style>

<template type="text/babel">

<v-flex xs12 md6>
    <v-card class="dark--text" v-if="isVisible" transition="slide-y-reverse-transition">
        <v-card-title>
            <v-flex xs>
                <div class="headline"> <span v-if="cardName !== undefined "> {{ cardName }} - </span> {{ stopCode }}</div>
            </v-flex>

            <v-flex xs2 v-for="(button, i) in buttons">
                <v-icon @click="buttonAction(button)">{{ button }}</v-icon>
            </v-flex>
        </v-card-title>
        <v-list style="background: inherit">
            <v-list-tile v-for="(busLine, i) in busLines">
                <v-list-tile-action>
                    <v-chip color="accent" disabled>{{ busLine.line }}</v-chip>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>
                        <template v-for="(llegada, i) in busLine.llegadas">
                          <template v-if="i == 0">
                            {{ llegada }}
                          </template>
                          <template v-if="i != 0">
                            ,{{ llegada }}
                          </template>

                        </template>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-card>
</v-flex>

</template>

<script>
export default {
  name: 'bus-arrival-card',
  data () {
    return {
    }
  },
  methods: {
    buttonAction: function (icon) {
      console.log(icon)
      switch (icon) {
        case 'close':
          this.isVisible = false
          break
        case 'favorite':
          break
        default:
      }
    }
  },
  props: {
    cardName: {
      type: String,
      required: false
    },
    stopCode: {
      type: String,
      required: true
    },
    busLines: {
      type: Array,
      required: true
    },
    buttons: {
      type: Array,
      required: true
    },
    isVisible: {
      type: Boolean,
      required: true
    }

  }
}
</script>
