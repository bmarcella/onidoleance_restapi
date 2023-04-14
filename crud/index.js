const User = require('./entities/User');
const Role = require('./entities/Role');
const Administration = require('./entities/Administration');
const Country = require('./entities/Country');
const Departement = require('./entities/Departement');
const Arrondissement = require('./entities/Arrondissement');
const Commune = require('./entities/Commune');
const TypeRequest = require('./entities/TypeRequest');
const RequestInfo = require('./entities/RequestInfo');

module.exports = {
  package: 'onideclaration-api',
  app: 'onideclaration-api',
  description: 'Express Server used as API for the onideclaration Project application',
  author: 'oni',
  repos: 'https://github.com/oni/onideclaration-api.git',
  email: 'oni@gmail.com',
  entities: [
    Country,
    Departement,
    Arrondissement,
    Commune,
    Role,
    Administration,
    User,
    TypeRequest,
    RequestInfo
  ]
};
