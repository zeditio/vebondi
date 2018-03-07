<style>

.pull-right {
    float: right;
}

</style>

<template type="text/babel">

<v-flex xs12 md6>
    <v-card class="dark--text" v-if="muteableIsVisible" transition="slide-y-reverse-transition">
        <v-card-title>

            <v-flex xs>

                <span v-if="cardName" class="title">
                    {{ cardName }}
                  </span>
                <span v-else class="headline">
                    {{ stopCode }}
                  </span>
            </v-flex>
            <v-flex xs2>
                <div> <span class="grey--text"> {{ requestTime }} </span> </div>
            </v-flex>
            <v-flex xs2 v-for="(button, i) in buttons" :key="button">
                <v-icon @click="buttonAction(button, stopCode)">{{ button }}</v-icon>
            </v-flex>
        </v-card-title>
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
    <v-snackbar :timeout="snackbarTimeout" :color="snackbarColor" v-model="snackbar">
        <span v-html="snackbarText"></span>
    </v-snackbar>

    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-form ref="form">
                <v-card-title>
                    <div class="headline"> Añadir a Favoritos </div>
                </v-card-title>
                <v-card-text>
                    <v-text-field label="Nombre" v-model="muteableCardName" :rules="nameRules" :counter="10" required></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" flat @click="saveCard()">Guardar</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</v-flex>

</template>

<script>
import axios from 'axios'

export default {
  name: 'bus-arrival-card',
  data () {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      snackbarTimeout: 2000,
      dialog: false,
      muteableCardName: '',
      muteableBusLines: this.busLines,
      muteableIsVisible: this.isVisible,
      requestTime: '',
      nameRules: [
        v => !!v || 'Nombre requerido',
        v => v.length <= 10 || 'El nombre debe ser menor a 10 caracteres'
      ]
    }
  },
  methods: {
    buttonAction: function (icon, stopCode) {
      switch (icon) {
        case 'close':
          this.muteableIsVisible = false
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
      axios.get('/api/busstop/' + this.stopCode)
        .then(response => {
          this.muteableIsVisible = true
          let date = new Date()
          let minutes = ('0' + date.getMinutes()).slice(-2)
          this.requestTime = date.getHours() + ':' + minutes
          console.log(response.data)
          this.muteableBusLines = response.data

          this.snackbarText = 'Parada ' + this.stopCode + ' actualizada exitosamente'
          this.snackbarColor = 'success'
          this.snackbarTimeout = 2000
          this.snackbar = false
          this.snackbar = true
          if (this.$route.name === 'llegadas') {
            this.saveCard()
          }
        })
        .catch(e => {
          this.muteableIsVisible = false
          this.snackbarColor = 'error'
          this.snackbarText = 'Error Interno del Servicio de Colectivos. <br> Intentelo mas tarde.'
          this.snackbarTimeout = 10000
          this.snackbar = false
          this.snackbar = true
          console.log(e)
        })
    },
    saveCard: function () {
      if (!this.$refs.form.validate()) {
        // Native form submission is not yet supported
        return
      }
      this.dialog = false
      this.$props.cardName = this.muteableCardName
      this.$props.busLines = this.muteableBusLines
      let savedCards = localStorage.getItem('savedCards')
      console.log(savedCards)
      if (savedCards === null) {
        savedCards = []
      } else {
        savedCards = JSON.parse(savedCards)
      }
      console.log(savedCards)
      for (var i = 0; i < savedCards.length; i++) {
        if (savedCards[i].stopCode === this.stopCode) {
          savedCards.splice(i, 1)
        }
      }
      savedCards.unshift(this.$props)
      localStorage.setItem('savedCards', JSON.stringify(savedCards))

      if (this.$route.name === 'buscar') {
        this.snackbarColor = 'success'
        this.snackbarText = 'Parada ' + this.stopCode + ' guardada exitosamente'
        this.snackbar = false
        this.snackbar = true
      }
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
