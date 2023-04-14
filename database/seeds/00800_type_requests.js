const faker = require('faker/locale/en');

exports.seed = function (knex, Promise) {
  // Insert seed entries
  const models = [];

  for (let i = 0; i < 100; i++) {
    models.push({
      code: faker.name.findName().slice(0, 255),
      value: faker.name.findName().slice(0, 255),
      isActif: faker.random.boolean(),
      isPublic: faker.random.boolean()

    });
  }

  return knex('type_requests').insert(models);
};
