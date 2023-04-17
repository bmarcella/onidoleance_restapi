const Administration = require('../../models/Administration');
const Controller = require('../Controller');
const Auth = require('./Auth');
const bookshelf = require('../../../database/config');

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

  blockUnblockAdmin (req, res, next) {
    const { id } = req.auth;
    const { admin_id, isBlocked } = req.body;
    console.log({admin_id,isBlocked})
    bookshelf.knex.transaction((t) => {
      if (![0, 1].includes(Number(isBlocked))) { throw new Error('You can use 0:Unblock or 1:Block') }
      return this.txDataFetcher(t, Administration, [{ key: 'id', value: id }, { key: 'isActif', value: 1 }], [], false, [])
        .then((admin) => {
          if (!admin) { throw new Error('Admin account not found or blocked. [E-002]') }
          if (![1, 2].includes(admin.get('role_id'))) { throw new Error('You dont have authorization to perform this action. ![0-PA]') }
          return this.txDataFetcher(t, Administration, [{ key: 'id', value: admin_id }, { key: 'role_id', middle: 'NOT IN', value: [1] }], [], false, [])
            .then((resultAdminUser) => {
              if (!resultAdminUser) { throw new Error('Your account dont dont have authorization to perform this action on another super admin account. [E-002]') }
              if (Number(resultAdminUser.get('isActif')) === Number(isBlocked)) { throw new Error(`User already ${isActif === 0 ? 'Unblock' : 'Blocked'} ![AL-001]`) }
              return this.knexUpdaterFunc(t, resultAdminUser, { isActif: isBlocked, session_token: null }, true)
            })
        })
    }).then((model) => {
      this.functionResponse(model, res, true, 200)
    }).catch(error => {
      const details = this.getErrorDetails(error);
      this.functionResponse(details, res, false, 400);
    });
  }
}

module.exports = AdministrationController;
