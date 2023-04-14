
exports.up = function (knex, Promise) {
  return knex.schema.createTable('countries', function (table) {
    table.increments('id').primary();
    table.string('name', 250).notNullable();
    table.string('code', 250).notNullable();

    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());
  }).then(() => knex('countries').insert([{ name: 'HAÏTI', code: 'HT' }]));
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('countries');
};
