' use strict ';
const mongoose = require('mongoose'),
      receptor = mongoose.model('receptor');

exports.list_all_receptors = (req, res) => {
  receptor.find({}, (err, receptor) => {
    if (err)
      res.send(err);
    res.json(receptor);  
  });
};

exports.create_a_receptor = (req, res) => {
  let new_receptor = new receptor(req.body);
  new_receptor.save((err, receptor) => {
    if (err)
      res.send(err);
    res.json(receptor);  
  });
};

exports.read_a_receptor = (req, res) => {
  receptor.findById(req.params.receptorId, (err, receptor) => {
    if (err)
      res.send(err);
    res.json(receptor);  
  });
};

exports.update_receptor = (req, res) => {
  receptor.findOneAndUpdate({_id: req.params.firmaId}, req.body, {new: true}, (err) => {
    if (err)
      res.send(err);
    res.json(receptor);  
  });
};

exports.delete_receptor = (req, res) => {
  receptor.remove((err, receptor) => {
    if (err)
      res.send(err);
    res.json({message: 'Se elimino correctamente'});  
  });
};
