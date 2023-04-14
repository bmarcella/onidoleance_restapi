const Swagger = require('./Swagger');
const Auth = require('./Auth');
const Country = require('./Country');
const Departement = require('./Departement');
const Arrondissement = require('./Arrondissement');
const Commune = require('./Commune');
const Role = require('./Role');
const Administration = require('./Administration');
const User = require('./User');
const TypeRequest = require('./TypeRequest');
const RequestInfo = require('./RequestInfo');

class Index {
  constructor (crud, doc) {
    this.crud = crud;
    this.doc = doc;
  }

  generate () {
    this.doc = {
      paths: {}
    };

    // auth endpoints (Auth doc will be empty if not using authentication)
    // retrieve Auth entity
    const entities = this.crud.entities.filter(ent => {
      return Object.prototype.hasOwnProperty.call(ent, 'auth');
    });

    if (entities.length) {
      const auth = new Auth(entities[0]);
      const data = auth.generate();
      this.doc.paths = {
        ...this.doc.paths,
        ...data.paths
      };
      this.doc.components = {
        ...this.doc.components,
        ...data.components
      };
    }

    // PUT ALL SWAGGER CONTROLLERS with Documentation code HERE
    // auto-generated endpoints
    const swagger = new Swagger(this.crud, this.doc);
    this.doc = swagger.generate();

    // Documentation for Country
    const country = new Country(this.crud, this.doc, this.getEntity('Country'));
    this.doc = country.generate();
    // Documentation for Departement
    const departement = new Departement(this.crud, this.doc, this.getEntity('Departement'));
    this.doc = departement.generate();
    // Documentation for Arrondissement
    const arrondissement = new Arrondissement(this.crud, this.doc, this.getEntity('Arrondissement'));
    this.doc = arrondissement.generate();
    // Documentation for Commune
    const commune = new Commune(this.crud, this.doc, this.getEntity('Commune'));
    this.doc = commune.generate();
    // Documentation for Role
    const role = new Role(this.crud, this.doc, this.getEntity('Role'));
    this.doc = role.generate();
    // Documentation for Administration
    const administration = new Administration(this.crud, this.doc, this.getEntity('Administration'));
    this.doc = administration.generate();
    // Documentation for User
    const user = new User(this.crud, this.doc, this.getEntity('User'));
    this.doc = user.generate();
    // Documentation for TypeRequest
    const typeRequest = new TypeRequest(this.crud, this.doc, this.getEntity('TypeRequest'));
    this.doc = typeRequest.generate();
    // Documentation for RequestInfo
    const requestInfo = new RequestInfo(this.crud, this.doc, this.getEntity('RequestInfo'));
    this.doc = requestInfo.generate();

    return this.doc;
  }

  getEntity (entityName) {
    return this.crud.entities.filter(entity => {
      return entity.name === entityName;
    })[0];
  }
}

module.exports = Index;
