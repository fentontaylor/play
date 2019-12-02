
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('favorites', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('artist_name').notNullable();
      table.string('genre').defaultTo('Unknown').notNullable();
      table.integer('rating').notNullable();


      table.timestamps(true, true);
    })
  ])
};


exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('favorites')
  ]);
}
