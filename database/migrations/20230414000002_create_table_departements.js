
exports.up = function (knex, Promise) {
  return knex.schema.createTable('departements', function (table) {
    table.increments('id').primary();
    table.integer('country_id').unsigned();
    table.string('name', 250).notNullable();
    table.string('description', 250);
    table.string('zip_code', 250);

    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());

    table.foreign('country_id').references('countries.id').onUpdate('CASCADE').onDelete('RESTRICT');
  }).then(() => knex('departements').insert([
    { country_id: 1, name: 'Artibonite' },
    { country_id: 1, name: 'Centre' },
    { country_id: 1, name: 'Grand-Anse' },
    { country_id: 1, name: 'Nippes' },
    { country_id: 1, name: 'Nord' },
    { country_id: 1, name: 'Nord-Est' },
    { country_id: 1, name: 'Nord-Ouest' },
    { country_id: 1, name: 'Ouest' },
    { country_id: 1, name: 'Sud' },
    { country_id: 1, name: 'Sud-Est' }
  ]));
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('departements');
};
