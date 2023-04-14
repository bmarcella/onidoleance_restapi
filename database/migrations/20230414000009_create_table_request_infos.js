
exports.up = function (knex, Promise) {
  return knex.schema.createTable('request_infos', function (table) {
    table.increments('id').primary();
    table.integer('type_request_id').unsigned();
    table.integer('user_id').unsigned();
    table.integer('administration_id').unsigned();
    table.integer('commune_id').unsigned().notNullable();
    table.integer('lieudeposition_id').unsigned();
    table.string('code', 255).notNullable().index().unique();
    table.string('firstname', 255).notNullable();
    table.string('lastname', 255).notNullable().index();
    table.date('date_birthday');
    table.string('lieu_birthday', 255);
    table.string('address', 255);
    table.string('phone', 255);
    table.string('email', 255);
    table.string('document', 255);
    table.text('commentaire');
    table.enum('priority', ['0', '1', '2', '3', '4', '5']).index().defaultTo('1');
    table.enum('status', ['0', '1', '2', '3', '4', '5', '6', '7', '8']).index().defaultTo('1');
    table.enum('sexe', ['0', '1', '2', '3', '4']).defaultTo('4');
    table.string('desc_lieu_carte', 255);
    table.string('desc_lieu_deposition', 255);
    table.date('date_deposition').index();

    table.datetime('created_at').defaultTo(knex.fn.now()).index();
    table.datetime('updated_at').defaultTo(knex.fn.now());

    table.foreign('type_request_id').references('type_requests.id').onUpdate('CASCADE').onDelete('RESTRICT');
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('RESTRICT');
    table.foreign('administration_id').references('administrations.id').onUpdate('CASCADE').onDelete('RESTRICT');
    table.foreign('commune_id').references('communes.id').onUpdate('CASCADE').onDelete('RESTRICT');
    table.foreign('lieudeposition_id').references('communes.id').onUpdate('CASCADE').onDelete('RESTRICT');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('request_infos');
};
