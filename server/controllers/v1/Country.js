const Country = require('../../models/Country');
const Controller = require('../Controller');

class CountryController extends Controller {
  constructor () {
    super();
    this.Model = Country;
  }

  all (req, res, next) {
    this.attribs = {
      withRelated: []
    };
    super.all(req, res, next);
  }

  find (req, res, next) {
    this.attribs = {
      withRelated: []
    };
    super.find(req, res, next);
  }
}

module.exports = CountryController;
