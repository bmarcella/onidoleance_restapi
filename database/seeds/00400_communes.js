const faker = require('faker/locale/en');

exports.seed = function (knex, Promise) {
  // Insert seed entries
  const models = [];

  for (let i = 0; i < 1000; i++) {
    models.push({
      arrondissement_id: parseInt(Math.random() * 1000 + 1),
      name: faker.lorem.name().slice(0, 100),
      description: faker.lorem.text().slice(0, 250)

    });
  }

  return knex('communes').insert(models);
};
