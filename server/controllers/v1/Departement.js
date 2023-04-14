const Departement = require('../../models/Departement');
const Controller = require('../Controller');

class DepartementController extends Controller {
  constructor () {
    super();
    this.Model = Departement;
  }

  all (req, res, next) {
    this.attribs = {
      withRelated: ['country']
    };
    super.all(req, res, next);
  }

  find (req, res, next) {
    this.attribs = {
      withRelated: ['country']
    };
    super.find(req, res, next);
  }
}

module.exports = DepartementController;
