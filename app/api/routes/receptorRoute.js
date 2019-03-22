' use strict ';
module.exports = (app) => {
  const receptor = require('../controllers/receptorController');
  app.route('/receptor')
    .get(receptor.list_all_receptors)
    .post(receptor.create_a_receptor);
  
  app.route('/receptor/:receptorId')
    .get(receptor.read_a_receptor)
    .put(receptor.update_receptor)
    .delete(receptor.delete_receptor);  
};