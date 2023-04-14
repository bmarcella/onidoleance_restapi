const faker = require('faker/locale/en');

exports.seed = function (knex, Promise) {
  // Insert seed entries
  const models = [];

  for (let i = 0; i < 1000; i++) {
    models.push({
      name: faker.lorem.country().slice(0, 250),
      code: faker.lorem.name().slice(0, 250)

    });
  }

  return knex('countries').insert(models);
};
