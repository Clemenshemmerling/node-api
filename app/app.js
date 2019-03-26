const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  xml = require('./api/models/firmaModel'),
  receptor = require('./api/models/receptorModel'),
  bodyParser = require('body-parser'),
  axios = require('axios'),
  convert = require('xml-js');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo/Facturadb', {useNewUrlParser: true });

const postedData =
  `<?xml version='1.0' encoding='UTF-8'?>
  <SolicitaTokenRequest>
    <usuario>47250763</usuario>
    <apikey>2CjGSRYDfrkXOcW2xQbOEVV</apikey>
  </SolicitaTokenRequest>`;
let key = '';

axios.post('https://dev.api.ifacere-fel.com/fel-dte-services/api/solicitarToken', postedData, {
  headers: {
    'content-type': 'application/xml'
  }
})
  .then(res => {
    key = convert.xml2js(res.data, {compact: true, spaces: 2});
  })
  .catch(error => {
    console.log(error);
  });

io.sockets.on('connect', socket => {
  io.sockets.emit('key', key);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let firmaRoutes = require('./api/routes/firmaRoute');
firmaRoutes(app);

let recepotrRoutes = require('./api/routes/receptorRoute');
recepotrRoutes(app);

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

server.listen(port);

console.log('Servidor xml corriendo en puerto' + port);