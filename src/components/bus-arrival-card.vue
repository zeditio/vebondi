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
                            - {{ llegada }}
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
import axios from 'axios'
import convert from 'xml-js'

export default {
  name: 'bus-arrival-card',
  data () {
    return {
    }
  },
  methods: {
    buttonAction: function (icon) {
      switch (icon) {
        case 'close':
          this.isVisible = false
          break
        case 'favorite':
          this.getArrivals()
          break
        default:
      }
    },
    getArrivals: function () {
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
          var resultString = convert.xml2json(response.data, {compact: true, spaces: 4})
          var result = JSON.parse(resultString)
          var resultArray = result['soap:Envelope']['soap:Body'].RecuperarProximosArribosResponse.RecuperarProximosArribosResult.ProximoArribo

          for (var i = 0; i < this.busLines.length; i++) {
            this.busLines[i].llegadas = []
            for (var j = 0; j < resultArray.length; j++) {
              var lineNumber = parseInt(resultArray[j].linea._text)
              if (this.busLines[i].line === lineNumber) {
                let cleanText = resultArray[j].arribo._text.replace(/. aprox./g, '')
                this.busLines[i].llegadas.push(cleanText)
              }
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
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
