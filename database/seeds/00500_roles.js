const faker = require('faker/locale/en');

exports.seed = function (knex, Promise) {
  // Insert seed entries
  const models = [];

  for (let i = 0; i < 100; i++) {
    models.push({
      code: faker.name.findName().slice(0, 255),
      value: faker.name.findName().slice(0, 255),
      opt_read: faker.random.boolean(),
      opt_create: faker.random.boolean(),
      opt_update: faker.random.boolean(),
      opt_delete: faker.random.boolean()

    });
  }

  return knex('roles').insert(models);
};
