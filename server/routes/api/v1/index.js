const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
// token authorization
const { verifyToken } = require('../../../middlewares/authorization');

// Import Multer Factory
const MulterFactory = require('../../MulterFactory');

// Declare Controllers
// Auth Controller
const AuthController = require('../../../controllers/v1/Auth');

// Other Controllers
const TestController = require('../../../controllers/v1/Test');
const CountryController = require('../../../controllers/v1/Country');
const DepartementController = require('../../../controllers/v1/Departement');
const ArrondissementController = require('../../../controllers/v1/Arrondissement');
const CommuneController = require('../../../controllers/v1/Commune');
const RoleController = require('../../../controllers/v1/Role');
const AdministrationController = require('../../../controllers/v1/Administration');
const UserController = require('../../../controllers/v1/User');
const TypeRequestController = require('../../../controllers/v1/TypeRequest');
const RequestInfoController = require('../../../controllers/v1/RequestInfo');

// Create Multers for file uploading
const requestInfoMulter = MulterFactory.create('requestInfo');
const administrationMulter = MulterFactory.create('administration');
const userMulter = MulterFactory.create('user');

// Instanciate Controllers
const test = new TestController();
const country = new CountryController();
const departement = new DepartementController();
const arrondissement = new ArrondissementController();
const commune = new CommuneController();
const role = new RoleController();
const auth = new AuthController();
const administration = new AdministrationController();
const user = new UserController();
const typeRequest = new TypeRequestController();
const requestInfo = new RequestInfoController();

router.get('/', function (req, res) {
  console.log('onideclaration-api API v1');
  res
    .status(200)
    .send({ status: 'Success', api: 'Version 1' })
});

// endpoint for authentication
router.get('/auth', verifyToken, auth.auth.bind(auth));
router.post('/signin', auth.signin.bind(auth));
router.post('/signup', verifyToken,administrationMulter.fields([{ name: 'avatar' }]),auth.signup.bind(auth));

// endpoint for testing API Flow with Versions, should return api v1
router.get('/tests', test.check.bind(test));

// endpoint for countries (CRUD)
router.get('/countries', country.all.bind(country));
router.get('/countries/:id', country.find.bind(country));
router.post('/countries', verifyToken, country.insert.bind(country));
router.put('/countries/:id', verifyToken, country.update.bind(country));
router.delete('/countries/:id', verifyToken, country.delete.bind(country));
// endpoint for departements (CRUD)
router.get('/departements', departement.all.bind(departement));
router.get('/departements/:id', departement.find.bind(departement));
router.post('/departements', verifyToken, departement.insert.bind(departement));
router.put('/departements/:id', verifyToken, departement.update.bind(departement));
router.delete('/departements/:id', verifyToken, departement.delete.bind(departement));
// endpoint for arrondissements (CRUD)
router.get('/arrondissements', arrondissement.all.bind(arrondissement));
router.get('/arrondissements/:id', arrondissement.find.bind(arrondissement));
router.post('/arrondissements', verifyToken, arrondissement.insert.bind(arrondissement));
router.put('/arrondissements/:id', verifyToken, arrondissement.update.bind(arrondissement));
router.delete('/arrondissements/:id', verifyToken, arrondissement.delete.bind(arrondissement));
// endpoint for communes (CRUD)
router.get('/communes', commune.all.bind(commune));
router.get('/communes/:id', commune.find.bind(commune));
router.post('/communes', verifyToken, commune.insert.bind(commune));
router.put('/communes/:id', verifyToken, commune.update.bind(commune));
router.delete('/communes/:id', verifyToken, commune.delete.bind(commune));
// endpoint for roles (CRUD)
router.get('/roles', verifyToken, role.all.bind(role));
router.get('/roles/:id', verifyToken, role.find.bind(role));
router.post('/roles', verifyToken, role.insert.bind(role));
router.put('/roles/:id', verifyToken, role.update.bind(role));
router.delete('/roles/:id', verifyToken, role.delete.bind(role));
// endpoint for administrations (CRUD)
router.get('/administrations', verifyToken, administration.all.bind(administration));
router.get('/administrations/:id', verifyToken, administration.find.bind(administration));
router.post('/administrations', verifyToken, administrationMulter.fields([{ name: 'avatar' }]), administration.insert.bind(administration));
router.put('/administrations/:id', verifyToken, administrationMulter.fields([{ name: 'avatar' }]), administration.update.bind(administration));
router.delete('/administrations/:id', verifyToken, administration.delete.bind(administration));
// endpoint for users (CRUD)
router.get('/users', verifyToken, user.all.bind(user));
router.get('/users/:id', verifyToken, user.find.bind(user));
router.post('/users', verifyToken, userMulter.fields([{ name: 'avatar' }]), user.insert.bind(user));
router.put('/users/:id', verifyToken,  userMulter.fields([{ name: 'avatar' }]), user.update.bind(user));
router.delete('/users/:id', verifyToken, user.delete.bind(user));
// endpoint for type-requests (CRUD)
router.get('/type-requests', verifyToken, typeRequest.all.bind(typeRequest));
router.get('/type-requests/:id', verifyToken, typeRequest.find.bind(typeRequest));
router.post('/type-requests', verifyToken, typeRequest.insert.bind(typeRequest));
router.put('/type-requests/:id', verifyToken, typeRequest.update.bind(typeRequest));
router.delete('/type-requests/:id', verifyToken, typeRequest.delete.bind(typeRequest));
// endpoint for request-infos (CRUD)
router.get('/request-infos', verifyToken, requestInfo.all.bind(requestInfo));
router.get('/request-infos/:id', verifyToken, requestInfo.find.bind(requestInfo));
router.post(
  '/request-infos',
  verifyToken,
  requestInfoMulter.fields([{ name: 'document' }]),
  requestInfo.insert.bind(requestInfo)
);
router.put(
  '/request-infos/:id',
  verifyToken,
  requestInfoMulter.fields([{ name: 'document' }]),
  requestInfo.update.bind(requestInfo)
);
router.delete('/request-infos/:id', verifyToken, requestInfo.delete.bind(requestInfo));
router.post('/revoke-admin', verifyToken, administration.blockUnblockAdmin.bind(administration));

router.get('/media/:type/:file_name', (req, res, next) => {
  const currentPath = path.join(__dirname, '../', '../', '../', '../', 'public', 'files', req.params.type, req.params.file_name || 'default.png');
  const existCheck = fs.pathExistsSync(currentPath);
  if (existCheck) { res.sendFile(currentPath); } else { res.send({}); }
});

module.exports = router;
