
exports.up = function (knex, Promise) {
  return knex.schema.createTable('administrations', function (table) {
    table.increments('id').primary();
    table.integer('role_id').unsigned();
    table.string('full_name', 255);
    table.string('ninu', 255).notNullable().index().unique();
    table.string('email', 255).notNullable().index().unique();
    table.boolean('isFirstLogin').notNullable().defaultTo(1);
    table.boolean('isActif').notNullable().defaultTo(1);
    table.string('password', 128);

    table.datetime('created_at').defaultTo(knex.fn.now()).index();
    table.datetime('updated_at').defaultTo(knex.fn.now());

    table.foreign('role_id').references('roles.id').onUpdate('CASCADE').onDelete('RESTRICT');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('administrations');
};
