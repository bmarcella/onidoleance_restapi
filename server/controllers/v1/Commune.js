const Commune = require('../../models/Commune');
const Controller = require('../Controller');

class CommuneController extends Controller {
  constructor () {
    super();
    this.Model = Commune;
  }

  all (req, res, next) {
    this.attribs = {
      withRelated: ['arrondissement']
    };
    super.all(req, res, next);
  }

  find (req, res, next) {
    this.attribs = {
      withRelated: ['arrondissement']
    };
    super.find(req, res, next);
  }
}

module.exports = CommuneController;
