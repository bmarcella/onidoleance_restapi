module.exports = {
  name: 'User',
  plural: 'Users',
  seedAmount: 100,
  auth: ['phone', 'password'],
  defaultAuth: '+50931222200',
  fields: [
    {
      name: 'firstname',
      type: 'string',
      length: 255,
      faker: 'name.findName'
    },
    {
      name: 'lastname',
      type: 'string',
      length: 255,
      faker: 'name.findName'
    },
    {
      name: 'phone',
      type: 'string',
      length: 255,
      faker: 'internet.phone',
      nullable: false,
      unique: true,
      index: true
    },
    {
      name: 'pin',
      type: 'string',
      length: 128,
      faker: 'internet.pin'
    },
    {
      name: 'isActif',
      type: 'boolean',
      nullable: false,
      default: 1
    }
  ],
  relations: {
    hasMany: ['RequestInfo'],
    belongsTo: ['Commune']
  }
};
