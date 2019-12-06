
exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('playlists', function(t) {
      t.unique('title')
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.table.dropUnique('playlists_title_unique')
  ])
};
