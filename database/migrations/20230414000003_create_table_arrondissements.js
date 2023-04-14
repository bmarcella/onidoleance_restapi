
exports.up = function (knex, Promise) {
  return knex.schema.createTable('arrondissements', function (table) {
    table.increments('id').primary();
    table.integer('departement_id').unsigned();
    table.string('name', 250).notNullable().unique();
    table.string('description', 250);

    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());

    table.foreign('departement_id').references('departements.id').onUpdate('CASCADE').onDelete('RESTRICT');
  }).then(() => knex('arrondissements').insert([
    { departement_id: 1, name: 'Marchand dessalines' },
    { departement_id: 1, name: 'Gonaïves' },
    { departement_id: 1, name: 'Gros-mornes' },
    { departement_id: 1, name: 'Marmelade' },
    { departement_id: 1, name: 'Saint-marc' },
    { departement_id: 2, name: 'Cerca-La-Source' },
    { departement_id: 2, name: 'Hinche' },
    { departement_id: 2, name: 'Lascahobas' },
    { departement_id: 2, name: 'Mirebalais' },
    { departement_id: 3, name: 'Anse-d\'Ainault' },
    { departement_id: 3, name: 'Corail' },
    { departement_id: 3, name: 'Jeremie' },
    { departement_id: 4, name: 'Anse-à-Veau' },
    { departement_id: 4, name: 'Baradères' },
    { departement_id: 4, name: 'Miragoâne' },
    { departement_id: 5, name: 'Acul-du-Nord' },
    { departement_id: 5, name: 'Borgne' },
    { departement_id: 5, name: 'Cap-Haïtien' },
    { departement_id: 5, name: 'Grande-Rivière-du-Nord' },
    { departement_id: 5, name: 'Limbé' },
    { departement_id: 5, name: 'Plaissance' },
    { departement_id: 5, name: 'Saint-Raphaële' },
    { departement_id: 6, name: 'Fort-Liberté' },
    { departement_id: 6, name: 'Ouanaminthe' },
    { departement_id: 6, name: 'Trou-du-Nord' },
    { departement_id: 6, name: 'Vallières' },
    { departement_id: 7, name: 'Môle-Saint-Nicolas' },
    { departement_id: 7, name: 'Port-de-Paix' },
    { departement_id: 7, name: 'Saint-Louis-du-Nord' },
    { departement_id: 8, name: 'Archaie' },
    { departement_id: 8, name: 'Croix-des-Bouquets' },
    { departement_id: 8, name: 'La Gonâve' },
    { departement_id: 8, name: 'Léogâne' },
    { departement_id: 8, name: 'Port-au-Prince' },
    { departement_id: 10, name: 'Bainet' },
    { departement_id: 10, name: 'Belle-Anse' },
    { departement_id: 10, name: 'Jacmel' },
    { departement_id: 9, name: 'Aquin' },
    { departement_id: 9, name: 'Les Cayes' },
    { departement_id: 9, name: 'Chardonnières' },
    { departement_id: 9, name: 'Côteaux' },
    { departement_id: 9, name: 'Port-Salut' }
  ]));
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('arrondissements');
};
