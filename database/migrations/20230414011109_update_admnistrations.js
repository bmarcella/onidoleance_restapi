
exports.up = function (knex) {
  return knex.schema.table('administrations', (table) => {
    table.string('code', 250).notNullable();
    table.unique(['code', 'email']);
  });
};

exports.down = function (knex) {
  //
}
