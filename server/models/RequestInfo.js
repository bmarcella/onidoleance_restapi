const bookshelf = require('../../database/config');

const RequestInfo = bookshelf.Model.extend({
  tableName: 'request_infos',
  hasTimeStamps: true,
  hidden: [''],
  virtuals: {
    media_path: function () {
      return this.get('document') ? `/media/requestInfo/${this.get('document')}` : null;
    }
  },
  typeRequest () {
    return this.belongsTo('TypeRequest');
  },
  user () {
    return this.belongsTo('User');
  },
  administration () {
    return this.belongsTo('Administration');
  },
  commune () {
    return this.belongsTo('Commune');
  },
  lieudeposition () {
    return this.belongsTo('Commune', 'lieudeposition_id');
  }

});

module.exports = bookshelf.model('RequestInfo', RequestInfo);
