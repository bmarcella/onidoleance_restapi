const bookshelf = require('../../database/config');

const Arrondissement = bookshelf.Model.extend({
  tableName: 'arrondissements',
  hasTimeStamps: true,
  hidden: [''],
  departement () {
    return this.belongsTo('Departement');
  },
  communes () {
    return this.hasMany('Commune');
  }

});

module.exports = bookshelf.model('Arrondissement', Arrondissement);
