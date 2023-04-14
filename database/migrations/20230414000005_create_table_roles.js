
exports.up = function (knex, Promise) {
  return knex.schema.createTable('roles', function (table) {
    table.increments('id').primary();
    table.string('code', 255).index();
    table.string('value', 255).index();
    table.boolean('opt_read').notNullable().defaultTo(1);
    table.boolean('opt_create').notNullable().defaultTo(1);
    table.boolean('opt_update').notNullable().defaultTo(1);
    table.boolean('opt_delete').notNullable().defaultTo(1);

    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());

    table.unique(['code', 'value'], 'codevalue_role')
  }).then(() => knex('roles').insert([
    { code: 'SU-01', value: 'SUPERADMIN' },
    { code: 'SA-01', value: 'ADMIN' },
    { code: 'CL-01', value: 'CLERCK' },
    { code: 'OBS-01', value: 'OBSERVATEUR' }
  ]));
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('roles');
};
