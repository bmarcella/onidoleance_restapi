const RequestInfo = require('../../models/RequestInfo');
const Controller = require('../Controller');

class RequestInfoController extends Controller {
  constructor () {
    super();
    this.Model = RequestInfo;
  }

  all (req, res, next) {
    this.attribs = {
      withRelated: ['typeRequest', 'user', 'administration', 'commune', 'lieudeposition']
    };
    super.all(req, res, next);
  }

  find (req, res, next) {
    this.attribs = {
      withRelated: ['typeRequest', 'user', 'administration', 'commune', 'lieudeposition']
    };
    super.find(req, res, next);
  }

  insert (req, res, next) {
    req.body.code = this.codeGenerator('REQ');
    super.insert(req, res, next);
  }
}

module.exports = RequestInfoController;
