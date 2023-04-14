const bookshelf = require('../../database/config');

const Role = bookshelf.Model.extend({
  tableName: 'roles',
  hasTimeStamps: true,
  hidden: [''],
  administrations () {
    return this.hasMany('Administration');
  }

});

module.exports = bookshelf.model('Role', Role);
