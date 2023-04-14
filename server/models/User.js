const bookshelf = require('../../database/config');

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimeStamps: true,
  hidden: [''],
  virtuals: {
    media_path: function () {
      return this.get('avatar') ? `/media/user/${this.get('avatar')}` : null;
    }
  },
  commune () {
    return this.belongsTo('Commune');
  },
  requestInfos () {
    return this.hasMany('RequestInfo');
  }

});

module.exports = bookshelf.model('User', User);
