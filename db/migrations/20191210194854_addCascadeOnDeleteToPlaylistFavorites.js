
exports.up = function(knex) {
  return knex.schema.table('playlist_favorites', (table) => {
    table.dropForeign('playlist_id', 'playlist_favorites_playlist_id_foreign');
    table.dropForeign('favorite_id', 'playlist_favorites_favorite_id_foreign');
  })
  .then(() => {
    return knex.schema.alterTable('playlist_favorites', (table) => {
      table.integer('playlist_id').unsigned()
        .notNullable()
        .references('playlists.id')
        .onDelete('CASCADE')
        .alter();
      table.integer('favorite_id').unsigned()
        .notNullable()
        .references('favorites.id')
        .onDelete('CASCADE')
        .alter();
    })
  })
};

exports.down = function(knex) {
  return knex.schema.table('playlist_favorites', (table) => {
    table.dropForeign('playlist_id', 'playlist_favorites_playlist_id_foreign');
    table.dropForeign('favorite_id', 'playlist_favorites_favorite_id_foreign');
  })
    .then(() => {
      return knex.schema.alterTable('playlist_favorites', (table) => {
        table.integer('playlist_id').unsigned()
          .notNullable()
          .references('playlists.id')
          .onDelete('NO ACTION')
          .alter();
        table.integer('favorite_id').unsigned()
          .notNullable()
          .references('favorites.id')
          .onDelete('NO ACTION')
          .alter();
      })
    })
};
