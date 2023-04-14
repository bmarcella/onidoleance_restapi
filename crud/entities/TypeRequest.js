module.exports = {
  name: 'TypeRequest',
  plural: 'TypeRequests',
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
      name: 'isActif',
      type: 'boolean',
      nullable: false,
      default: 1
    },
    {
      name: 'isPublic',
      type: 'boolean',
      nullable: false,
      default: 1
    }
  ],
  relations: {
    hasMany: ['RequestInfo']
  }
};
