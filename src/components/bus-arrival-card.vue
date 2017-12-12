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
            <v-flex xs2 v-for="(button, i) in buttons">
                <v-icon @click="buttonAction(button, stopCode)">{{ button }}</v-icon>
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
import convert from 'xml-js'

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

      const config = {
        'headers': {
          'Content-Type': 'text/xml'
        }
      }
      let data = `
      <v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
          <v:Header>
              <n0:UserDetails xmlns:n0="http://tempuri.org/">
                  <n0:userName>UsAnCL3280.</n0:userName>
                  <n0:password>PsAnCL3280.</n0:password>
              </n0:UserDetails>
          </v:Header>
          <v:Body>
              <RecuperarProximosArribos xmlns="http://tempuri.org/" id="o0" c:root="1">
                  <identificadorParada i:type="d:string">` + this.stopCode + `</identificadorParada>
                  <codigoLineaParada i:type="d:int">0</codigoLineaParada>
                  <codigoAplicacion i:type="d:int">0</codigoAplicacion>
                  <codigoEntidad i:type="d:int">0</codigoEntidad>
                  <localidad i:type="d:string">CIUDAD DE CORDOBA</localidad>
              </RecuperarProximosArribos>
          </v:Body>
      </v:Envelope>`

      axios.post('http://swandroidcuandollegasmp04.efibus.com.ar/Paradas.asmx', data, config)
        .then(response => {
          let date = new Date()
          let minutes = ('0' + date.getMinutes()).slice(-2)
          console.log(date)
          this.requestTime = date.getHours() + ':' + minutes
          let resultString = convert.xml2json(response.data, {compact: true, spaces: 4})
          let result = JSON.parse(resultString)
          let resultArray = result['soap:Envelope']['soap:Body'].RecuperarProximosArribosResponse.RecuperarProximosArribosResult.ProximoArribo

          for (let i = 0; i < this.busLines.length; i++) {
            this.busLines[i].llegadas = []
            for (let j = 0; j < resultArray.length; j++) {
              let lineNumber = parseInt(resultArray[j].linea._text)
              if (this.busLines[i].line === lineNumber) {
                let cleanText = resultArray[j].arribo._text.replace(/. aprox./g, '')
                this.busLines[i].llegadas.push(cleanText)
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
