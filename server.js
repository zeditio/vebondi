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
const mongoose = require('mongoose'); // mongoose for mongodb
const fs = require('fs'); // mongoose for mongodb
const JsonFile = require('./src/assets/bus-stops.json')


// configuration ===============================================================
mongoose.Promise = Promise;
mongoose.connect('mongodb://vebondi:tgwHQLI3pHpvLxwr@cluster-1-shard-00-00-ambv7.mongodb.net:27017,cluster-1-shard-00-01-ambv7.mongodb.net:27017,cluster-1-shard-00-02-ambv7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-1-shard-0&authSource=admin'); // connect to mongoDB database on modulus.io
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connection open')
});

// FRONT END
// =============================================================================
if (process.env.NODE_ENV === 'production') {
  console.log("production mode: front end mounted");
  app.use(express.static(path.join(__dirname, 'dist')))
} else {
  console.log("development mode: front end not mounted.");
}
// configure app to use bodyParser()// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 8081 // set our port

// define model ================================================================
var Schema = mongoose.Schema

// create a schema
var responseSchema = new Schema({
  stopCode: String,
  httpStatus: Number,
  line: Number,
  latitudParada: Number,
  longitudParada: Number,
  latitud: Number,
  longitud: Number,
  text: String,
  created_at: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now
  }
})

// the schema is useless so far
// we need to create a model using it
// make this available to our users in our Node applications
var ResponseDatabase = mongoose.model('ResponseDatabase', responseSchema)

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
          if (parsedContent.line === -1) {
            var responseDatabaseObj = new ResponseDatabase();
            responseDatabaseObj.stopCode = req.params.code
            responseDatabaseObj.httpStatus = 501;
            responseDatabaseObj.save(function(err) {
              if (err) throw err;
              console.log('\x1b[32m', 'Response saved successfully');
            })
            console.log('\x1b[31m', 'Parada inexistente, eliminar: ' + req.params.code);
            res.status(501)
            res.send('Parada inexistente, reportar al administrador (@joseboretto): ' + req.params.code)
          }
          parsedArray.push(parsedContent)
        }
        //sometimes is an Array
        for (let i = 0; i < serverResponse.length; i++) {
          let parsedContent = parseXml(serverResponse[i])
          if (parsedContent.line === -1) {
            var responseDatabaseObj = new ResponseDatabase();
            responseDatabaseObj.stopCode = req.params.code
            responseDatabaseObj.httpStatus = 501;
            responseDatabaseObj.save(function(err) {
              if (err) throw err;
              console.log('\x1b[32m', 'Response saved successfully');
            })
            console.log('\x1b[31m', 'Parada inexistente, eliminar: ' + req.params.code);
            res.status(501)
            res.send('Parada inexistente, reportar al administrador (@joseboretto): ' + req.params.code)
          }
          //copy all data
          var responseDatabaseObj = new ResponseDatabase();
          responseDatabaseObj.stopCode = req.params.code
          responseDatabaseObj.httpStatus = 200
          responseDatabaseObj.line = parsedContent.line
          if (!isNaN(parsedContent.latitudParada)) {
            responseDatabaseObj.latitudParada = parsedContent.latitudParada
            responseDatabaseObj.longitudParada = parsedContent.longitudParada
          }
          responseDatabaseObj.latitud = parsedContent.latitud
          responseDatabaseObj.longitud = parsedContent.longitud
          responseDatabaseObj.longitud = parsedContent.longitud
          responseDatabaseObj.text = parsedContent.text
          responseDatabaseObj.save(function(err) {
            if (err) {
              console.log(err);
              throw err;
            }
            console.log('\x1b[32m', 'Response saved successfully');
          })
          parsedArray.push(parsedContent)
        }
        console.log('3- Parsed Array: ')
        console.log(parsedArray)
        console.log('\x1b[32m', 'Exito');
        res.setHeader('Content-Type', 'application/json')
        res.send(parsedArray)
      } else {
        var responseDatabaseObj = new ResponseDatabase();
        responseDatabaseObj.stopCode = req.params.code
        responseDatabaseObj.httpStatus = 503;
        responseDatabaseObj.save(function(err) {
          if (err) throw err;
          console.log('\x1b[32m', 'Response saved successfully');
        })
        console.log('\x1b[31m', 'Error, Service  Unavailable ');
        res.status(503)
        res.send('Service Unavailable')
      }






    })
    .catch(e => {
      console.log(e)
    })
})


router.get('/database/findAll', function(req, res) {
  // get all the users
  ResponseDatabase.find()
    .then(responses => {
      console.log(responses);
      res.setHeader('Content-Type', 'application/json');
      res.send(responses);
    })
    .catch(e => {
      console.log(e)
    });
})

router.get('/database/workingLines', function(req, res) {
  ResponseDatabase.aggregate([{
        $match: {
          httpStatus: 200
        }
      },
      {
        $group: {
          _id: "$line"
        }
      }, {
        $sort: {
          _id: 1
        }
      }
    ])
    .then(responses => {
      res.setHeader('Content-Type', 'application/json');
      res.send(responses);
    })
    .catch(e => {
      console.log('aggregate error');
      console.log(e)
    });
})

router.get('/database/workingStops/:line', function(req, res) {
  console.log(req.params.line);
  var projection = {
    stopCode: 1,
    httpStatus: 1,
    line: 1,
    latitudParada: 1,
    longitudParada: 1
  }

  var query = {
    line: req.params.line
  }
  ResponseDatabase.aggregate([{
      $match: query
    }, {
      $project: projection
    }])
    .then(responses => {
      res.setHeader('Content-Type', 'application/json');
      res.send(responses);
    })
    .catch(e => {
      console.log('aggregate error');
      console.log(e)
    });
})



router.get('/testAll', function(req, res) {
  for (var i = JsonFile.length - 1; i > 0; i--) {
    var stopCode = JsonFile[i].stopCode
    setTimeout(testAPI(stopCode), 2000 * i);
  }
  res.send()
})


function testAPI(stopCode) {
  return function() {
    // does something with param
    console.log(stopCode);
    axios.get('https://vebondi.com/api/busstop/' + stopCode)
      .then(response => {
        var object = {
          stopCode: stopCode,
          status: true
        }
        appendDataToFile('tetAllResult', object);
        console.log('success, ' + stopCode);
      })
      .catch(e => {
        var object = {
          stopCode: stopCode,
          status: false
        }
        appendDataToFile('tetAllResult', object);
        console.log('error, ' + stopCode);
      })
  }
}


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
console.log('> Starting Express Server...');
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

function appendDataToFile(fileName, newData) {
  fs.readFile(fileName + '.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      obj = JSON.parse(data); //now it an object
      obj.push(newData); //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile(fileName + '.json', json, 'utf8', function() {
        console.log('writeFile');
      }); // write it back
    }
  });
}