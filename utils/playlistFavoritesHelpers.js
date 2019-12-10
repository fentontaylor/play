const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const createPlaylistFavorite = async function(playlistId, favoriteId) {
  try {
    let result = await database('playlist_favorites')
      .insert({ playlist_id: playlistId, favorite_id: favoriteId }, 'id')
      .returning('*');
    return result[0];
  } catch(e) {
    return e;
  }
}

async function deletePlaylistFavorite(playlistId, favId) {
  try {
    return await database('playlist_favorites')
      .where({ playlist_id: playlistId, favorite_id: favId })
      .del()
  } catch (e) {
    return e;
  }
}

module.exports = {
  createPlaylistFavorite: createPlaylistFavorite,
  deletePlaylistFavorite: deletePlaylistFavorite
}
