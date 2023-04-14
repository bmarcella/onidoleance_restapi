const faker = require('faker/locale/en');

exports.seed = function (knex, Promise) {
  // Insert seed entries
  const models = [];

  for (let i = 0; i < 1000; i++) {
    models.push({
      country_id: parseInt(Math.random() * 1000 + 1),
      name: faker.lorem.country().slice(0, 250),
      descripction: faker.lorem.name().slice(0, 250),
      zip_code: faker.lorem.name().slice(0, 250)

    });
  }

  return knex('departements').insert(models);
};
