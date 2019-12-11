exports.seed = async function (knex) {
  let playlistIds = await knex('playlists').pluck('id')
  let favoriteIds = await knex('favorites').pluck('id')

  return knex('playlist_favorites').del()
  .then(() => {
    return knex('playlist_favorites').insert([
      {
        playlist_id: playlistIds[0],
        favorite_id: favoriteIds[0]
      },
      {
        playlist_id: playlistIds[0],
        favorite_id: favoriteIds[1]
      },
      {
        playlist_id: playlistIds[1],
        favorite_id: favoriteIds[2]
      }
    ])
    .then(() => console.log('PlaylistFavorites seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
