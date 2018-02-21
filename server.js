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


// FRONT END
// =============================================================================
if (process.env.NODE_ENV === 'production') {
  console.log("production mode: front end mounted");
  app.use(express.static(path.join(__dirname, 'dist')))
} else {
  console.log("front end not mounted");
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
              <identificadorParada i:type="d:string">` + req.params.code + `</identificadorParada>
              <codigoLineaParada i:type="d:int">0</codigoLineaParada>
              <codigoAplicacion i:type="d:int">0</codigoAplicacion>
              <codigoEntidad i:type="d:int">0</codigoEntidad>
              <localidad i:type="d:string">CIUDAD DE CORDOBA</localidad>
          </RecuperarProximosArribos>
      </v:Body>
  </v:Envelope>`

  axios.post('http://swandroidcuandollegasmp04.efibus.com.ar/Paradas.asmx', data, config)
    .then(response => {
      console.log('')
      console.log(new Date(), '  ===============================================')
      console.log(response.data)
      let resultString = convert.xml2json(response.data, {
        compact: true,
        spaces: 4
      })
      let result = JSON.parse(resultString)
      let serverResponse = result['soap:Envelope']['soap:Body'].RecuperarProximosArribosResponse.RecuperarProximosArribosResult.ProximoArribo
      console.log('')
      console.log(new Date(), ' serverResponse ===============================================')
      console.log(JSON.stringify(serverResponse))
      if (serverResponse !== undefined) {
        //clean the xml
        let parsedArray = []
        //sometimes is an object
        if (serverResponse.length == undefined) {
          let parsedContent = {}
          let lineNumber = parseInt(serverResponse.linea._text)
          parsedContent.line = lineNumber
          let cleanText = serverResponse.arribo._text.replace(/. aprox./g, '')
          parsedContent.text = cleanText
          parsedArray.push(parsedContent)
        }
        //sometimes is an Array
        for (let j = 0; j < serverResponse.length; j++) {
          let parsedContent = {}
          let lineNumber = parseInt(serverResponse[j].linea._text)
          parsedContent.line = lineNumber
          let cleanText = serverResponse[j].arribo._text.replace(/. aprox./g, '')
          parsedContent.text = cleanText
          parsedArray.push(parsedContent)
        }
        console.log(new Date(), ' parsedArray ===============================================')
        console.log(parsedArray)
        let map = new HashMap()
        //group the result by line in lineal order
        for (let i = 0; i < parsedArray.length; i++) {
          let currentLine = parsedArray[i].line
          if (map.has(currentLine)) {
            let text = map.get(currentLine)
            text = text + ' ' + parsedArray[i].text + ','
            map.set(currentLine, text)
          } else {
            let text = parsedArray[i].text + ','
            map.set(currentLine, text)
          }

        }
        console.log(new Date(), ' map ===============================================')

        console.log(map)
        let responseArray = []
        map.forEach(function(value, key) {
          let object = {}
          object.line = key
          //Remove last comma
          value = value.replace(/,\s*$/, "")
          object.text = value
          responseArray.push(object)
        });
        res.setHeader('Content-Type', 'application/json')
        res.send(responseArray)
      } else {
        res.status(503)
        res.send('Service Unavailable')
      }
    })
    .catch(e => {
      console.log(e)
    })
})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router)

// START THE SERVER
// =============================================================================
console.log('> Starting Express Server...')
app.listen(port)
console.log('Magic happens on port ' + port)