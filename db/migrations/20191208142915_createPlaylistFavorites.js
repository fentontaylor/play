
exports.up = (knex) => {
  return knex.schema.createTable('playlist_favorites', (t) => {
    t.increments('id').primary();
    t.integer('playlist_id').unsigned().notNullable().references('playlists.id');
    t.integer('favorite_id').unsigned().notNullable().references('favorites.id');
  })
};

exports.down = (knex) => {
  return knex.schema.dropTable('playlist_favorites')
};
