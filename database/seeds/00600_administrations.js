const faker = require('faker/locale/en');
const AuthController = require('../../server/controllers/v1/Auth');

exports.seed = function (knex, Promise) {
  // Inserts seed entries
  const models = [];
  const auth = new AuthController();

  return auth.genSalt().then(salt => auth.genHash('Pass1234', salt)).then(hash => {
    // push a first record with a default email to signin fot token
    models.push(
      {
        role_id: parseInt(Math.random() * 100 + 1),
        full_name: faker.name.findName().slice(0, 255),
        ninu: faker.lorem.sentence().slice(0, 255),
        email: faker.internet.email().slice(0, 255),
        isFirstLogin: faker.random.boolean(),
        isActif: faker.random.boolean(),
        password: hash,
        ...{ email: 'default@email.com' }
      }
    );

    for (let i = 0; i < (100 - 1); i++) {
      models.push({
        role_id: parseInt(Math.random() * 100 + 1),
        full_name: faker.name.findName().slice(0, 255),
        ninu: faker.lorem.sentence().slice(0, 255),
        email: faker.internet.email().slice(0, 255),
        isFirstLogin: faker.random.boolean(),
        isActif: faker.random.boolean(),
        password: hash

      });
    }

    return knex('administrations').insert(models);
  })
    .catch(error => {
      console.log('administrations seeds error', error);
    });
};
