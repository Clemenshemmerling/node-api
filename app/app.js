const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  xml = require('./api/models/firmaModel'),
  receptor = require('./api/models/receptorModel'),
  bodyParser = require('body-parser');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo/Facturadb', {useNewUrlParser: true });

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