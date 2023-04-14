const bookshelf = require('../../database/config');

const Departement = bookshelf.Model.extend({
  tableName: 'departements',
  hasTimeStamps: true,
  hidden: [''],
  country () {
    return this.belongsTo('Country');
  },
  arrondissements () {
    return this.hasMany('Arrondissement');
  }

});

module.exports = bookshelf.model('Departement', Departement);
