module.exports = {
  name: 'Arrondissement',
  plural: 'Arrondissements',
  seedAmount: 1000,
  fields: [
    {
      name: 'name',
      type: 'string',
      length: 250,
      nullable: false,
      unique: true,
      faker: 'lorem.name'
    },
    {
      name: 'description',
      type: 'string',
      length: 250,
      faker: 'lorem.text'
    }
  ],
  relations: {
    hasMany: [
      'Commune'
    ],
    belongsTo: [
      'Departement'
    ]
  }
};
