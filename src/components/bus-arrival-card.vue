<style>


</style>

<template type="text/babel">

  <v-flex xs12 md6>
    <v-card class="dark--text" v-if="isVisibleMuteable" transition="slide-y-reverse-transition">
      <v-card-title>
        <v-flex xs>
                <span v-if="cardNameMuteable" class="body-2">
                    <b>{{ cardNameMuteable }}</b>
                  </span>
          <span v-else class="headline">
                    {{ stopCode }}
                  </span>
        </v-flex>
        <v-flex xs2>
          <div><span class="grey--text text-xs-center"> {{ requestTime }} </span></div>
        </v-flex>
        <v-flex xs1>
          <v-icon @click="buttonAction('refresh', stopCode)">refresh</v-icon>
        </v-flex>
        <v-flex xs2 v-for="(button, i) in buttons" :key="button" class="text-xs-center">
          <template v-if="button === 'more_vert'">
            <v-menu bottom left>
              <v-btn icon slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile @click="editCardName()">
                  <v-list-tile-title>Editar</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="deleteCard(stopCode)">
                  <v-list-tile-title>Eliminar</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>

          </template>
          <template v-else>
            <v-icon @click="buttonAction(button, stopCode)">{{ button }}</v-icon>
          </template>
        </v-flex>
        <v-flex xs12>
          <a v-bind:href="'https://maps.google.com/?q=' + lat + ',' + lng" target="_blank">
            {{ cardAddressMuteable }}
          </a>
        </v-flex>

      </v-card-title>
      <v-divider></v-divider>
      <v-list style="background: inherit">
        <v-list-tile v-for="(busLine, i) in muteableBusLines" :key="busLine.line">
          <v-list-tile-action>
            <v-chip color="accent" disabled>{{ busLine.line }}</v-chip>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ busLine.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
    <v-snackbar :timeout="snackbarTimeout" :color="snackbarColor" v-model="snackbar" vertical multi-line>
      <span v-html="snackbarText"></span>
    </v-snackbar>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-form ref="form">
          <v-card-title>
            <div class="headline"> Editar Nombre</div>
          </v-card-title>
          <v-card-text>
            <v-flex xs12>
              <v-text-field label="Nombre" v-model="cardNameMuteable" required hint="Maximo 20 caracteres"
                            counter="20"></v-text-field>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" flat @click.native="dialog = false">Cancelar</v-btn>
            <v-btn color="green" flat @click.native="saveCard()">Guardar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-flex>

</template>

<script>
import axios from 'axios'

const HashMap = require('hashmap')

export default {
  name: 'bus-arrival-card',
  data () {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      snackbarTimeout: 2000,
      dialog: false,
      muteableBusLines: this.busLines,
      isVisibleMuteable: this.isVisible,
      requestTime: '¿?',
      cardAddressMuteable: this.cardAddress,
      cardNameMuteable: this.cardName,
      busLinesMuteable: this.busLines

    }
  },
  methods: {
    buttonAction: function (icon, stopCode) {
      switch (icon) {
        case 'close':
          this.isVisibleMuteable = false
          break
        case 'favorite':
          this.dialog = true
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
      if (navigator.onLine) {
        this.$store.commit({
          type: 'showPageLoader'
        })
        axios.get('/api/busstop/' + this.stopCode)
          .then(response => {
            if (!this.cardAddress) {
              this.getCardAddress()
            }
            this.$store.commit({
              type: 'hidePageLoader'
            })
            this.isVisibleMuteable = true
            let date = new Date()
            let minutes = ('0' + date.getMinutes()).slice(-2)
            this.requestTime = date.getHours() + ':' + minutes
            console.log(response.data)

            let map = new HashMap()
            // group the result by line in lineal order
            for (let i = 0; i < response.data.length; i++) {
              let currentLine = response.data[i].line
              if (map.has(currentLine)) {
                let text = map.get(currentLine)
                text = text + ' ' + response.data[i].text + ','
                map.set(currentLine, text)
              } else {
                let text = response.data[i].text + ','
                map.set(currentLine, text)
              }
            }
            let responseArray = []
            map.forEach(function (value, key) {
              let object = {}
              object.line = key
              // Remove last comma
              value = value.replace(/,\s*$/, '')
              object.text = value
              responseArray.push(object)
            })
            this.muteableBusLines = responseArray
            this.saveCard()
            this.$ga.event({
              eventCategory: 'map',
              eventAction: 'get_arraivals_sucess'
            })
          })
          .catch(e => {
            this.$store.commit({
              type: 'hidePageLoader'
            })
            this.isVisibleMuteable = false
            this.snackbarColor = 'light-blue darken-4'
            this.snackbarText = 'Informacion no disponible temporalmte.  <br>Intente otra parada o pruebe mas tarde. <br> Parada: ' + this.stopCode
            this.snackbarTimeout = 5000
            this.snackbar = false
            this.snackbar = true
            console.log(e)
            this.$ga.event({
              eventCategory: 'map',
              eventAction: 'get_arraivals_error'
            })
          })
      } else {
        this.snackbarColor = 'light-yellow darken-4'
        this.snackbarText = 'No es posible actualizar los horarios sin conexiona internet'
        this.snackbarTimeout = 5000
        this.snackbar = false
        this.snackbar = true
      }
    },
    saveCard: function () {
      if (this.dialog === true && this.cardNameMuteable.length > 20) {
        return
      }
      this.dialog = false
      let cardState = {
        cardName: this.cardNameMuteable,
        cardAddress: this.cardAddressMuteable,
        stopCode: this.stopCode,
        lat: this.lat,
        lng: this.lng,
        busLines: this.muteableBusLines,
        isVisible: true
      }

      let savedCards = localStorage.getItem('savedCards')
      // la primera vez que se guardan da nulo
      if (savedCards === null) {
        savedCards = []
      } else {
        savedCards = JSON.parse(savedCards)
      }
      // elimino la tarjeta si ya fue guardada anteriormente
      for (var i = 0; i < savedCards.length; i++) {
        if (savedCards[i].stopCode === this.stopCode) {
          savedCards.splice(i, 1)
        }
      }
      // se agrega pero primero
      savedCards.unshift(cardState)
      localStorage.setItem('savedCards', JSON.stringify(savedCards))
    },
    editCardName: function () {
      this.dialog = true
      this.cardNameMuteable = ''
      // ga('send', 'event', '[category]', '[action]', '[label]', [value]);
      this.$ga.event({
        eventCategory: 'card_event',
        eventAction: 'edit_card_name'
      })
    },
    deleteCard: function (stopCode) {
      this.$ga.event({
        eventCategory: 'card_event',
        eventAction: 'delete_card'
      })
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
    },
    getCardAddress: function () {
      if (!this.cardAddress) {
        this.$store.commit({
          type: 'showPageLoader'
        })
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.lat + ',' + this.lng + '&sensor=true')
          .then((data) => {
            this.$store.commit({
              type: 'hidePageLoader'
            })
            this.cardAddressMuteable = data.data.results['0'].address_components[1].short_name + ' ' + data.data.results['0'].address_components[0].short_name

            this.saveCard()
          })
      }
    }
  },
  props: {
    cardName: {
      type: String,
      required: false
    },
    cardAddress: {
      type: String,
      required: false
    },
    stopCode: {
      required: true
    },
    lat: {
      required: true
    },
    lng: {
      required: true
    },
    busLines: {
      type: Array,
      required: false
    },
    buttons: {
      type: Array,
      required: true
    },
    isVisible: {
      required: false
    }
  },
  watch: {
    // whenever question changes, this function will run
    stopCode: function () {
      if (this.isVisible) {
        if (!this.busLines) {
          this.getArrivals()
        }
      }
    }
  }
}
</script>
