module.exports = {
  name: 'Departement',
  plural: 'Departements',
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
      name: 'descripction',
      type: 'string',
      length: 250,
      nullable: false,
      faker: 'lorem.name'
    },
    {
      name: 'zip_code',
      type: 'string',
      length: 250,
      nullable: false,
      faker: 'lorem.name'
    }
  ],
  relations: {
    hasMany: [
      'Arrondissement'
    ],
    belongsTo: [
      'Country'
    ]
  }
};
