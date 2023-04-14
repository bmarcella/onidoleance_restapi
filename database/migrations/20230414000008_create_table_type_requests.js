
exports.up = function (knex, Promise) {
  return knex.schema.createTable('type_requests', function (table) {
    table.increments('id').primary();
    table.string('code', 255).index();
    table.string('value', 255).index();
    table.boolean('isActif').notNullable().defaultTo(1);
    table.boolean('isPublic').notNullable().defaultTo(1);

    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());

    table.unique(['code', 'value'], 'codevalue_type')
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('type_requests');
};
