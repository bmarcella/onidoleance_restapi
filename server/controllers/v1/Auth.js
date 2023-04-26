/* eslint-disable camelcase */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const Administration = require('../../models/Administration.js');
const Controller = require('../Controller');
const jwt = require('jsonwebtoken');
const bookshelf = require('../../../database/config/index.js');

class Auth extends Controller {
  constructor () {
    super();
    this.round = process.env.HASH_TOUR || 10;
  }

  // Find auth model from current token
  auth (req, res) {
    this.txDataFetcher(null, Administration, [{ key: 'id', value: req.auth.id }], [], true, [])
      .then((result) => {
        this.functionResponse(result, res, true, 200);
      })
      .catch((error) => {
        const details = this.getErrorDetails(error);
        this.functionResponse({ ...details, message: details.message !== 'EmptyResponse' ? details.message : 'Could not retrieve Authenticated administration' }, res, false, 400);
      })
  }

  // Signup method for administration
  signup (req, res) {
    const data = req.body;
    data.password = this.genHash(data.password, this.genSalt());
    if ([1, 2].includes(Number(data.role_id))) {
      this.txItemSaver(null, Administration, { ...data, code: this.codeGenerator('OA'), isActif: 1 }, true)
        .then(result => {
          this.functionResponse(result, res, true, 200)
        })
        .catch((error) => {
          const details = this.getErrorDetails(error);
          this.functionResponse({ ...details, message: details.message !== 'EmptyResponse' ? details.message : 'Could not signup the admin user![ER-SG]' }, res, false, 400);
        })
    } else {
      this.functionResponse({ message: 'Could not signup the admin user![RO-SG]' }, res, false, 400);
    }
  }

  // Create administration signin process
  signin (req, res) {
    const data = req.body;

    bookshelf.knex.transaction((t) => {
      return this.txDataFetcher(t, Administration, [{ key: 'ninu', value: data.ninu }, { key: 'isActif', value: 1 }], [], true, []).then((result) => {
        const resultJSON = result.toJSON()
        delete resultJSON.session_token;
        delete resultJSON.role;
        const passwordCheck = this.compare(data.password, result.get('password'));
        const isFirstLogin = result.get('isFirstLogin');
        if (!passwordCheck) { throw new Error('Wrong admin credentials'); }

        const token = jwt.sign({ ...resultJSON, user_agent: req.get('User-Agent') || 'N/A', url: req.headers.host, ip_location: `${req.headers['x-forwarded-for']} || ${req.socket.remoteAddress}` }, process.env.JWT_SECRET, { expiresIn: '720h' });
        return this.knexUpdaterFunc(t, result, { isFirstLogin: 0 }, true)
          .then(() => {
            return { ...result.toJSON(), session_token: token, isFirstLogin: isFirstLogin }
          })
      })
    }).then((result) => {
      this.functionResponse(result, res, true, 201);
    }).catch((error) => {
      const details = this.getErrorDetails(error);
      this.functionResponse({ ...details, message: details.message !== 'EmptyResponse' ? details.message : 'Could not signin the admin user' }, res, false, 400);
    })
  }

  blockUnblockAdmin (req, res, next) {
    const { id } = req.auth;
    const { admin_id, isBlocked } = req.body;

    bookshelf.knex.transaction((t) => {
      if (![0, 1].includes(Number(isBlocked))) { throw new Error('You can use 0:Unblock or 1:Block') }
      return this.txDataFetcher(t, Administration, [{ key: 'id', value: id }, { key: 'isBlocked', value: 0 }], [], false, [])
        .then((admin) => {
          if (!admin) { throw new Error('Admin account not found or blocked. [E-002]') }
          if ([1, 2].includes(admin.get('role_id'))) { throw new Error('You dont have authorization to perform this action. ![0-PA]') }
          return this.txDataFetcher(t, Administration, [{ key: 'id', value: admin_id }, { key: 'role_id', middle: 'NOT IN', value: [1] }], [], false, [])
            .then((resultAdminUser) => {
              if (!resultAdminUser) { throw new Error('Your account dont dont have authorization to perform this action on another super admin account. [E-002]') }
              if (Number(resultAdminUser.get('isBlocked')) === Number(isBlocked)) { throw new Error(`User already ${isBlocked === 0 ? 'Unblock' : 'Blocked'} ![AL-001]`) }
              return this.knexUpdaterFunc(t, resultAdminUser, { isBlocked: isBlocked, session_token: null }, true)
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

module.exports = Auth;
