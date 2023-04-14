module.exports = {
  name: 'RequestInfo',
  plural: 'RequestInfos',
  seedAmount: 100,
  fields: [
    {
      name: 'code',
      type: 'string',
      length: 255,
      index: true,
      nullable: false,
      unique: true
    },
    {
      name: 'firstname',
      type: 'string',
      length: 255,
      faker: 'name.findName',
      nullable: false
    },
    {
      name: 'lastname',
      type: 'string',
      length: 255,
      faker: 'name.findName',
      nullable: false,
      index: true
    },
    {
      name: 'date_birthday',
      type: 'date',
      nullable: true,
      faker: 'lorem.date'
    },
    {
      name: 'lieu_birthday',
      type: 'string',
      nullable: true
    },
    {
      name: 'address',
      type: 'string',
      nullable: true
    },
    {
      name: 'phone',
      type: 'string',
      nullable: true
    },
    {
      name: 'email',
      type: 'string',
      nullable: true
    },
    {
      name: 'document',
      type: 'string',
      length: 255,
      file: true
    },
    {
      name: 'commentaire',
      type: 'text'
    },
    {
      name: 'priority',
      type: 'enum',
      default: '1', // 0 1 2 3 4 5 6 7 8 9
      index: true
    },
    {
      name: 'status', // 0 1 2 3 4 5 6 7 8 9
      type: 'enum',
      default: '1',
      index: true
    },
    {
      name: 'sexe',
      type: 'enum', // 0 1 2 3
      default: '1'
    },
    {
      name: 'lieu_carte',
      type: 'string',
      nullable: true
    },
    {
      name: 'lieu_deposition',
      type: 'string',
      nullable: true
    },
    {
      name: 'date_deposition',
      type: 'date',
      nullable: true,
      faker: 'lorem.date',
      index: true
    }
  ],
  relations: {
    belongsTo: ['TypeRequest', 'User', 'Administration', 'Commune'],
    hasOne: []
  }
};
