const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const plHelpers = require('./playlistsHelpers');
const findPlaylist = plHelpers.findPlaylist;
const dateFormat = require('dateformat');

async function findPlaylistFavorite(playlistId, favoriteId) {
  try {
    return await database('playlist_favorites')
      .where({ playlist_id: playlistId, favorite_id: favoriteId })
      .first()
  } catch(e) {
    return e;
  }
}

async function createPlaylistFavorite(playlistId, favoriteId) {
  try {
    let result = await database('playlist_favorites')
      .insert({ playlist_id: playlistId, favorite_id: favoriteId }, 'id')
      .returning('*');
    return result[0];
  } catch(e) {
    return e;
  }
}

async function allPlaylistFavorites(playlistId) {
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

async function countFavorites(playlistId) {
  try {
    let res =  await database('playlist_favorites')
      .join('favorites', { 'favorites.id': 'playlist_favorites.favorite_id' })
      .where({ playlist_id: playlistId })
    return res.length;
  } catch(e) {
    return e;
  }
}

async function songAvgRating(playlistId) {
  try {
    let res = await database('playlist_favorites')
      .join('favorites', { 'favorites.id': 'playlist_favorites.favorite_id' })
      .where({ playlist_id: playlistId })
      .avg('favorites.rating')
    if (res[0].avg === null) {
      return 0;
    } else {
      return parseFloat(parseFloat(res[0].avg).toFixed(2));
    }
  } catch(e) {
    return e;
  }
}

async function playlistInfo(playlistId) {
  try {
    let info = await findPlaylist(playlistId);
    let songCount = await countFavorites(playlistId);
    let avgRating = await songAvgRating(playlistId);
    let favorites = await allPlaylistFavorites(playlistId);

    return {
      id: info.id,
      title: info.title,
      songCount: songCount,
      songAvgRating: avgRating,
      favorites: favorites,
      createdAt: dateFormat(info.created_at, "isoDateTime"),
      updatedAt: dateFormat(info.updated_at, "isoDateTime")
    }
  } catch(e) {
    return e;
  }
}

async function deletePlaylistFavorite(targetId) {
  try {
    return await database('playlist_favorites')
      .where({ favorite_id: targetId })
      .del()
  } catch (e) {
    return e;
  }
}

module.exports = {
  findPlaylistFavorite: findPlaylistFavorite,
  createPlaylistFavorite: createPlaylistFavorite,
  allPlaylistFavorites: allPlaylistFavorites,
  countFavorites: countFavorites,
  songAvgRating: songAvgRating,
  playlistInfo: playlistInfo,
  deletePlaylistFavorite: deletePlaylistFavorite
}