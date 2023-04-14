const TypeRequest = require('../../models/TypeRequest');
const Controller = require('../Controller');

class TypeRequestController extends Controller {
  constructor () {
    super();
    this.Model = TypeRequest;
  }

  all (req, res, next) {
    this.attribs = {
      withRelated: []
    };
    super.all(req, res, next);
  }

  insert (req, res, next) {
    req.body.code = this.codeGenerator('TY');
    super.insert(req, res, next);
  }

  find (req, res, next) {
    this.attribs = {
      withRelated: []
    };
    super.find(req, res, next); 
  }
}

module.exports = TypeRequestController;
