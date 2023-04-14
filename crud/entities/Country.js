module.exports = {
  name: 'Country',
  plural: 'Countries',
  seedAmount: 1000,
  fields: [
    {
      name: 'name',
      type: 'string',
      length: 250,
      nullable: false,
      faker: 'lorem.country'
    },
    {
      name: 'code',
      type: 'string',
      length: 250,
      nullable: false,
      faker: 'lorem.name'
    }
  ],
  relations: {
    hasMany: [
      'Departement'
    ]
  }
};
