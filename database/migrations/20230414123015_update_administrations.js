
exports.up = function (knex) {
    return knex.schema.table('administrations', (table) => {
        table.string('avatar', 255);
    }).then(()=>{
        return knex.schema.table('users', (table) => {
            table.string('avatar', 255);
        });
    });
  };
  
  exports.down = function (knex) {
    //
  }
  