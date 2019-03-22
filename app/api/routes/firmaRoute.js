' use strict ';
module.exports = (app) => {
  const firma = require('../controllers/firmaController');
  app.route('/firma')
    .get(firma.list_all_firmas)
    .post(firma.create_a_firma);
  
  app.route('/firma/:firmaId')
    .get(firma.read_a_firma)
    .put(firma.update_firma)
    .delete(firma.delete_firma);  
};