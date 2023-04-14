const Administration = require('../../models/Administration');
const Controller = require('../Controller');
const Auth = require('./Auth');

class AdministrationController extends Controller {
  constructor () {
    super();
    this.Model = Administration;
  }

  all (req, res, next) {
    this.attribs = {
      withRelated: ['role']
    };
    super.all(req, res, next);
  }

  find (req, res, next) {
    this.attribs = {
      withRelated: ['role']
    };
    super.find(req, res, next);
  }

  insert (req, res) {
    const data = req.body;

    Auth.hashPass(data.password, (password) => {
      data.password = password;
      const model = new this.Model();
      model.insert(data, (error, administration) => {
        if (error) {
          res.status(403).send({
            message: "Can't create the administration",
            error
          });
        } else {
          res.status(200).send(administration);
        }
      });
    });
  };

  update (req, res) {
    // remove password and email for body here
    const data = req.body;
    delete data.password;
    delete data.email;

    const model = new this.Model();
    model.update(req.params.id, data, (error, result) => {
      if (error) {
        res.status(400).send({ message: "Error can't update administration" });
      } else {
        res.status(200).send(result);
      }
    });
  };
}

module.exports = AdministrationController;
