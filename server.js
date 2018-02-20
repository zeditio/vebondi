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

// FRONT END
// =============================================================================
if (!process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, 'dist')))
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
router.get('/busstop/:code', function (req, res) {
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
      console.log('')
      console.log(new Date(), '  ===============================================')
      console.log(response.data)
      let resultString = convert.xml2json(response.data, {
        compact: true,
        spaces: 4
      })
      let result = JSON.parse(resultString)
      let resultArray = result['soap:Envelope']['soap:Body'].RecuperarProximosArribosResponse.RecuperarProximosArribosResult.ProximoArribo
      console.log('')
      console.log('')
      console.log(new Date(), '  ===============================================')
      console.log(JSON.stringify(resultArray))
      if (resultArray !== undefined) {
        var parsedArray = []
        for (let j = 0; j < resultArray.length; j++) {
          var parsedContent = {}
          let lineNumber = parseInt(resultArray[j].linea._text)
          parsedContent.line = lineNumber
          let cleanText = resultArray[j].arribo._text.replace(/. aprox./g, '')
          parsedContent.text = cleanText
          parsedArray.push(parsedContent)
        }
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(parsedArray))
      } else {
        res.status(500)
        res.send('bus stop error')
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
console.log('> Starting dev-express server...')
app.listen(port)
console.log('Magic happens on port ' + port)
