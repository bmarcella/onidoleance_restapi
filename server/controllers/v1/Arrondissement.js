const Arrondissement = require('../../models/Arrondissement');
const Controller = require('../Controller');

class ArrondissementController extends Controller {
  constructor () {
    super();
    this.Model = Arrondissement;
  }

  all (req, res, next) {
    this.attribs = {
      withRelated: ['departement']
    };
    super.all(req, res, next);
  }

  find (req, res, next) {
    this.attribs = {
      withRelated: ['departement']
    };
    super.find(req, res, next);
  }
}

module.exports = ArrondissementController;
