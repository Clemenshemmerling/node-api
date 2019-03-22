' use strict ';
const mongoose = require('mongoose'),
      xml = mongoose.model('xml');

exports.list_all_firmas = (req, res) => {
  xml.find({}, (err, factura) => {
    if (err)
      res.send(err);
    res.json(factura);  
  });
};

exports.create_a_firma = (req, res) => {
  let new_factura = new xml(req.body);
  new_factura.save((err, factura) => {
    if (err)
      res.send(err);
    res.json(factura);  
  });
};

exports.read_a_firma = (req, res) => {
  xml.findById(req.params.firmaId, (err, factura) => {
    if (err)
      res.send(err);
    res.json(factura);  
  });
};

exports.update_firma = (req, res) => {
  xml.findOneAndUpdate({_id: req.params.firmaId}, req.body, {new: true}, (err) => {
    if (err)
      res.send(err);
    res.json(factura);  
  });
};

exports.delete_firma = (req, res) => {
  xml.remove((err, factura) => {
    if (err)
      res.send(err);
    res.json({ message: 'Se elimino correctamente' });  
  }); 
};