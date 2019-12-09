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

const countFavorites = async function(playlistId) {
  try {
    let res =  await database('playlist_favorites')
      .join('favorites', { 'favorites.id': 'playlist_favorites.favorite_id' })
      .where({ playlist_id: playlistId })
    return res.length;
  } catch(e) {
    return e;
  }
}

const songAvgRating = async function(playlistId) {
  try {
    let res = await database('playlist_favorites')
      .join('favorites', { 'favorites.id': 'playlist_favorites.favorite_id' })
      .where({ playlist_id: playlistId })
      .avg('favorites.rating')
    return parseFloat(parseFloat(res[0].avg).toFixed(2));
  } catch(e) {
    return e;
  }
}

module.exports = {
  createPlaylistFavorite: createPlaylistFavorite,
  allPlaylistFavorites: allPlaylistFavorites,
  countFavorites: countFavorites,
  songAvgRating: songAvgRating
}