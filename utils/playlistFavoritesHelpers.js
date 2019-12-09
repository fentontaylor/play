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

const allPlaylistFavorites = async function(playlistId) {
  try {
    let res = await database('playlist_favorites')
      .select('favorites.id', 'favorites.title', 'favorites.artist_name', 'favorites.genre', 'favorites.rating')
      .join('favorites', { 'favorites.id': 'playlist_favorites.favorite_id'})
      .where({ playlist_id: playlistId })

    return res;
  } catch(e) {
    return e;
  }
}

module.exports = {
  createPlaylistFavorite: createPlaylistFavorite,
  allPlaylistFavorites: allPlaylistFavorites
}