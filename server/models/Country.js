const bookshelf = require('../../database/config');

const Country = bookshelf.Model.extend({
  tableName: 'countries',
  hasTimeStamps: true,
  hidden: [''],
  departements () {
    return this.hasMany('Departement');
  }

});

module.exports = bookshelf.model('Country', Country);
