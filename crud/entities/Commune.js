module.exports = {
  name: 'Commune',
  plural: 'Communes',
  seedAmount: 1000,
  fields: [
    {
      name: 'name',
      type: 'string',
      length: 100,
      nullable: false,
      faker: 'lorem.name'
    },
    {
      name: 'description',
      type: 'string',
      length: 250,
      nullable: false,
      faker: 'lorem.text'
    }
  ],
  relations: {
    hasMany: [
      'User', 'RequestInfo'
    ],
    belongsTo: [
      'Arrondissement'
    ]
  }
};
