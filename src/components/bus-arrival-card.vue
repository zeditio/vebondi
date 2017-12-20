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
            <v-flex xs2>
              <div> <span class="grey--text"> {{ requestTime }} </span> </div>
            </v-flex>
            <v-flex xs2 v-for="(button, i) in buttons" :key="button">
                <v-icon @click="buttonAction(button, stopCode)">{{ button }}</v-icon>
            </v-flex>
        </v-card-title>
        <v-list style="background: inherit">
            <v-list-tile v-for="(busLine, i) in busLines" :key="busLine.line">
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
                            - {{ llegada }}
                          </template>
                        </template>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-card>
    <v-snackbar
      :timeout="2000"
      color="success"
      v-model="snackbar">
      {{ snackbarText}}
    </v-snackbar>
</v-flex>

</template>

<script>
import axios from 'axios'

export default {
  name: 'bus-arrival-card',
  data () {
    return {
      requestTime: null,
      snackbar: false,
      snackbarText: ''
    }
  },
  methods: {
    buttonAction: function (icon, stopCode) {
      switch (icon) {
        case 'close':
          this.isVisible = false
          break
        case 'favorite':
          this.saveCard()
          break
        case 'refresh':
          this.getArrivals()
          break
        case 'delete':
          this.deleteCard(stopCode)
          break
        default:
      }
    },
    getArrivals: function () {
      for (let i = 0; i < this.busLines.length; i++) {
        this.busLines[i].llegadas = ['Cargando..']
      }

      axios.get('/api/busstop/' + this.stopCode)
        .then(response => {
          let date = new Date()
          let minutes = ('0' + date.getMinutes()).slice(-2)
          this.requestTime = date.getHours() + ':' + minutes
          console.log(response.data)
          var resultArray = response.data
          for (let i = 0; i < this.busLines.length; i++) {
            this.busLines[i].llegadas = []
            for (let j = 0; j < resultArray.length; j++) {
              if (this.busLines[i].line === resultArray[j].line) {
                this.busLines[i].llegadas.push(resultArray[j].text)
              }
            }
          }

          this.snackbarText = 'Parada ' + this.stopCode + ' actualizada exitosamente'
          this.snackbar = false
          this.snackbar = true
        })
        .catch(e => {
          console.log(e)
        })
    },
    saveCard: function () {
      let savedCards = localStorage.getItem('savedCards')
      console.log(savedCards)
      if (savedCards === null) {
        savedCards = []
      } else {
        savedCards = JSON.parse(savedCards)
      }
      console.log(savedCards)
      savedCards.push(this.$props)
      localStorage.setItem('savedCards', JSON.stringify(savedCards))
      this.snackbarText = 'Parada ' + this.stopCode + ' guardada exitosamente'
      this.snackbar = false
      this.snackbar = true
    },
    deleteCard: function (stopCode) {
      let savedCards = localStorage.getItem('savedCards')
      savedCards = JSON.parse(savedCards)
      console.log(savedCards)
      for (var i = 0; i < savedCards.length; i++) {
        if (savedCards[i].stopCode === stopCode) {
          savedCards.splice(i, 1)
          localStorage.setItem('savedCards', JSON.stringify(savedCards))
          this.$emit('deleteCard', stopCode)
          return
        }
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
  },
  watch: {
    // whenever question changes, this function will run
    stopCode: function () {
      if (this.isVisible) {
        this.getArrivals()
      }
    }
  }
}
</script>
