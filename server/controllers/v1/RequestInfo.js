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
    req.body.code = this.codeGenerator('RI');
    super.insert(req, res, next);
  }

  update (req, res, next) {
    // Find model to get old filenames
    req.oldFilepaths = [];

    new this.model({ id })
      .fetch(this.attribs)
      .then((model) => {
        req.oldFilepaths.push('public/files/' + model.get('document'));

        super.find(req, res, next);
      });
  }
}

module.exports = RequestInfoController;
