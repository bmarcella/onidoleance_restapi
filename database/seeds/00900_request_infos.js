const faker = require('faker/locale/en');

exports.seed = function (knex, Promise) {
  // Insert seed entries
  const models = [];

  for (let i = 0; i < 100; i++) {
    models.push({
      type_request_id: parseInt(Math.random() * 100 + 1),
      user_id: parseInt(Math.random() * 100 + 1),
      administration_id: parseInt(Math.random() * 100 + 1),
      commune_id: parseInt(Math.random() * 1000 + 1),
      code: faker.lorem.sentence().slice(0, 255),
      firstname: faker.name.findName().slice(0, 255),
      lastname: faker.name.findName().slice(0, 255),
      date_birthday: faker.lorem.date(),
      lieu_birthday: faker.lorem.sentence().slice(0, 255),
      address: faker.lorem.sentence().slice(0, 255),
      phone: faker.lorem.sentence().slice(0, 255),
      email: faker.lorem.sentence().slice(0, 255),
      document: faker.lorem.sentence().slice(0, 255),
      lieu_carte: faker.lorem.sentence().slice(0, 255),
      lieu_deposition: faker.lorem.sentence().slice(0, 255),
      date_deposition: faker.lorem.date()

    });
  }

  return knex('request_infos').insert(models);
};
