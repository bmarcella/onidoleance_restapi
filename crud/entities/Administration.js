module.exports = {
  name: 'Administration',
  plural: 'Administrations',
  seedAmount: 100,
  auth: ['email', 'password'],
  defaultAuth: 'default@email.com',
  fields: [
    {
      name: 'full_name',
      type: 'string',
      length: 255,
      faker: 'name.findName'
    },
    {
      name: 'ninu',
      type: 'string',
      length: 255,
      nullable: false,
      unique: true,
      index: true
    },
    {
      name: 'email',
      type: 'string',
      length: 255,
      faker: 'internet.email',
      nullable: false,
      unique: true,
      index: true
    },
    {
      name: 'isFirstLogin',
      type: 'boolean',
      nullable: false,
      default: 1
    },
    {
      name: 'isActif',
      type: 'boolean',
      nullable: false,
      default: 1
    },
    {
      name: 'password',
      type: 'string',
      length: 128,
      faker: 'internet.password'
    }

  ],
  relations: {
    belongsTo: ['Role'],
    hasMany: ['RequestInfo']
  }
};
