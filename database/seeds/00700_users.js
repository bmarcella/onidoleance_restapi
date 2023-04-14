const faker = require('faker/locale/en');
const AuthController = require('../../server/controllers/v1/Auth');

exports.seed = function (knex, Promise) {
  // Inserts seed entries
  const models = [];
  const auth = new AuthController();

  return auth.genSalt().then(salt => auth.genHash('Pass1234', salt)).then(hash => {
    // push a first record with a default phone to signin fot token
    models.push(
      {
        commune_id: parseInt(Math.random() * 1000 + 1),
        firstname: faker.name.findName().slice(0, 255),
        lastname: faker.name.findName().slice(0, 255),
        phone: faker.internet.phone().slice(0, 255),
        pin: faker.internet.pin().slice(0, 128),
        isActif: faker.random.boolean(),
        ...{ phone: '+50931222200' }
      }
    );

    for (let i = 0; i < (100 - 1); i++) {
      models.push({
        commune_id: parseInt(Math.random() * 1000 + 1),
        firstname: faker.name.findName().slice(0, 255),
        lastname: faker.name.findName().slice(0, 255),
        phone: faker.internet.phone().slice(0, 255),
        pin: faker.internet.pin().slice(0, 128),
        isActif: faker.random.boolean()

      });
    }

    return knex('users').insert(models);
  })
    .catch(error => {
      console.log('users seeds error', error);
    });
};
