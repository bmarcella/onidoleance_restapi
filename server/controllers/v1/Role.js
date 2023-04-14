const Role = require('../../models/Role');
const Controller = require('../Controller');

class RoleController extends Controller {
  constructor () {
    super();
    this.Model = Role;
  }

  all (req, res, next) {
    this.attribs = {
      withRelated: []
    };
    super.all(req, res, next);
  }

  insert (req, res, next) {
    req.body.code = this.codeGenerator('RL');
    super.insert(req, res, next);
  }

  find (req, res, next) {
    this.attribs = {
      withRelated: []
    };
    super.find(req, res, next);
  }
}

module.exports = RoleController;
