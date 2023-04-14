
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.integer('commune_id').unsigned();
    table.string('firstname', 255);
    table.string('lastname', 255);
    table.string('phone', 255).notNullable().index().unique();
    table.string('ninu', 255);
    table.string('pin', 255);
    table.boolean('isActif').notNullable().defaultTo(1).index();

    table.datetime('created_at').defaultTo(knex.fn.now()).index();
    table.datetime('updated_at').defaultTo(knex.fn.now());

    table.foreign('commune_id').references('communes.id').onUpdate('CASCADE').onDelete('RESTRICT');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
