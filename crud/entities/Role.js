module.exports = {
  name: 'Role',
  plural: 'Roles',
  seedAmount: 100,
  fields: [
    {
      name: 'code',
      type: 'string',
      length: 255,
      faker: 'name.findName',
      index: true
    },
    {
      name: 'value',
      type: 'string',
      length: 255,
      faker: 'name.findName',
      index: true
    },
    {
      name: 'opt_read',
      type: 'boolean',
      nullable: false,
      default: 1
    },
    {
      name: 'opt_create',
      type: 'boolean',
      nullable: false,
      default: 1
    },
    {
      name: 'opt_update',
      type: 'boolean',
      nullable: false,
      default: 1
    },
    {
      name: 'opt_delete',
      type: 'boolean',
      nullable: false,
      default: 1
    }
  ],
  relations: {
    hasMany: ['Administration']
  }
};
