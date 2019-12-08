
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('playlist_favorites', function(t) {
      t.increments('id').primary();
      t.integer('playlist_id').unsigned().references('id').inTable('playlists');
      t.integer('favorite_id').unsigned().references('id').inTable('favorites');
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('playlist_favorites')
  ])
};
