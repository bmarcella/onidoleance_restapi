const bookshelf = require('../../database/config');

const Administration = bookshelf.Model.extend({
  tableName: 'administrations',
  hasTimeStamps: true,
  hidden: [''],
  virtuals: {
    media_path: function () {
      return this.get('avatar') ? `/media/administration/${this.get('avatar')}` : null;
    }
  },
  role () {
    return this.belongsTo('Role');
  },
  requestInfos () {
    return this.hasMany('RequestInfo');
  }

});

module.exports = bookshelf.model('Administration', Administration);
