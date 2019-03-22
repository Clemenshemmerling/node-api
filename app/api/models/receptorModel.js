' use strict ';
const mongoose = require('mongoose');
const schema = mongoose.Schema({
  factura_id: 'string',
  info: {
    correoReceptor: 'string',
    IDReceptor: 'number',
    NombreReceptor: 'string'
  },
  direccion: {
    'dte:Direccion': 'string',
    'dte:CodigoPostal': 'string',
    'dte:Municipio': 'string',
    'dte:Departamento': 'string',
    'dte:Pais': 'string'
  }
});

module.exports = mongoose.model('receptor', schema);