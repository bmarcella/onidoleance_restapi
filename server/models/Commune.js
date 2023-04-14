const bookshelf = require('../../database/config');

const Commune = bookshelf.Model.extend({
  tableName: 'communes',
  hasTimeStamps: true,
  hidden: [''],
  arrondissement () {
    return this.belongsTo('Arrondissement');
  },
  users () {
    return this.hasMany('User');
  },
  requestInfos () {
    return this.hasMany('RequestInfo');
  }

});

module.exports = bookshelf.model('Commune', Commune);
