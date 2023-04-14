const bookshelf = require('../../database/config');

const TypeRequest = bookshelf.Model.extend({
  tableName: 'type_requests',
  hasTimeStamps: true,
  hidden: [''],
  requestInfos () {
    return this.hasMany('RequestInfo');
  }

});

module.exports = bookshelf.model('TypeRequest', TypeRequest);
