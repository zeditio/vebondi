// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express') // call express
const app = express() // define our app using express
const path = require('path')
const bodyParser = require('body-parser')
const axios = require('axios')
const convert = require('xml-js')
const cors = require('cors')
const HashMap = require('hashmap')
const JsonFile = require('./src/assets/bus-stops.json')


// FRONT END
// =============================================================================
if (process.env.NODE_ENV === 'production') {
  console.log("production mode: front end mounted");
  app.use(express.static(path.join(__dirname, 'dist')))
} else {
  console.log("development mode: front end not mounted.");
}


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 8081 // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router() // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/busstop/:code', function(req, res) {

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
              <identificadorParada i:type="d:string">C` + req.params.code + `</identificadorParada>
              <codigoLineaParada i:type="d:int">0</codigoLineaParada>
              <codigoAplicacion i:type="d:int">0</codigoAplicacion>
              <codigoEntidad i:type="d:int">0</codigoEntidad>
              <localidad i:type="d:string">CIUDAD DE CORDOBA</localidad>
          </RecuperarProximosArribos>
      </v:Body>
  </v:Envelope>`
  console.log('\x1b[36m%s\x1b[0m', new Date(), '  ===============================================')
  console.log('Request: ' + req.params.code);
  axios.post('http://swandroidcuandollegasmp04.efibus.com.ar/Paradas.asmx', data, config)
    .then(response => {
      console.log('1- Raw Response (' + new Date() + ') : ')
      console.log(response.data)
      let resultString = convert.xml2json(response.data, {
        compact: true,
        spaces: 4
      })
      let result = JSON.parse(resultString)
      let serverResponse = result['soap:Envelope']['soap:Body'].RecuperarProximosArribosResponse.RecuperarProximosArribosResult.ProximoArribo
      console.log('')
      console.log('2- Parsed Response: ')
      console.log(JSON.stringify(serverResponse))
      if (serverResponse !== undefined) {
        //clean the xml
        let parsedArray = []
        //sometimes is an object
        if (serverResponse.length == undefined) {
          let parsedContent = parseXml(serverResponse)
          if (parsedContent.lineNumber === -1) {
            console.log('\x1b[31m', 'Parada inexistente, eliminar: ' + req.params.code);
            res.status(501)
            res.send('Parada inexistente, reportar al administrador (@joseboretto): ' + req.params.code)
          }
          parsedArray.push(parsedContent)
        }
        //sometimes is an Array
        for (let i = 0; i < serverResponse.length; i++) {
          let parsedContent = parseXml(serverResponse[i])
          if (parsedContent.lineNumber === -1) {
            console.log('\x1b[31m', 'Parada inexistente, eliminar: ' + req.params.code);
            res.status(501)
            res.send('Parada inexistente, reportar al administrador (@joseboretto): ' + req.params.code)
          }
          parsedArray.push(parsedContent)
        }
        console.log('3- Parsed Array: ')
        console.log(parsedArray)
        console.log('\x1b[32m', 'Exito');
        res.setHeader('Content-Type', 'application/json')
        res.send(parsedArray)
      } else {
        console.log('\x1b[31m', 'Error, Service  Unavailable ');
        res.status(503)
        res.send('Service Unavailable')
      }
    })
    .catch(e => {
      console.log(e)
    })
})

router.get('/updateJsonFile', function(req, res) {
  var busStopUpdated = []
  for (var i = 0; i < 5; i++) {
    var busStop = JsonFile[i]
    console.log('Stop Code', busStop.stopCode)
    var busStopUpdatedObject = {}

    axios.get('https://vebondi.com/api/busstop/' + busStop.stopCode)
      .then(response => {
        busStopUpdatedObject.parada = busStop.stopCode
        busStopUpdatedObject.latitudParada = response[0].latitudParada
        busStopUpdatedObject.longitudParada = response[0].longitudParada

        let map = new HashMap()
        // group the result by line in lineal order
        for (let i = 0; i < response.data.length; i++) {
          let currentLine = response.data[i].line
          if (map.has(currentLine)) {
            map.set(currentLine, null)
          } else {
            map.set(currentLine, null)
          }

        }
        busStopUpdatedObject.lineas = map.keys()
        busStopUpdated.push(busStopUpdatedObject)
        console.log('busStopUpdatedObject', busStopUpdatedObject)
      })
      .catch((error) => {
        if (error.response.status === 503) {
          busStopUpdatedObject.parada = busStop.stopCode
          busStopUpdatedObject.latitudParada = busStop.lat
          busStopUpdatedObject.longitudParada = busStop.lng
          busStopUpdated.push(busStopUpdatedObject)
          console.log('busStopUpdatedObject', busStopUpdatedObject)
        }

      })




  }
  console.log(busStopUpdated);

})


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router)

// START THE SERVER
// =============================================================================
if (process.env.NODE_ENV === 'production') {
  console.log('Back and front on port: ' + port)
} else {
  console.log('Backend: ' + port)
  console.log('Frontend: 8081')

}
console.log('> Starting Express Server...')
app.listen(port)



function parseXml(serverResponse) {
  let parsedContent = {}
  let lineNumber = parseInt(serverResponse.linea._text)
  parsedContent.line = lineNumber

  let latitudParada = parseFloat(serverResponse.latitudParada._text)
  parsedContent.latitudParada = latitudParada
  let longitudParada = parseFloat(serverResponse.longitudParada._text)
  parsedContent.longitudParada = longitudParada

  let latitud = parseFloat(serverResponse.latitud._text)
  parsedContent.latitud = latitud
  let longitud = parseFloat(serverResponse.longitud._text)
  parsedContent.longitud = longitud

  let cleanText = serverResponse.arribo._text.replace(/. aprox./g, '')
  parsedContent.text = cleanText
  return parsedContent
}