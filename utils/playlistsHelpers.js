const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const helpers = require('./playlistFavoritesHelpers');
const countFavorites = helpers.countFavorites;
const songAvgRating = helpers.songAvgRating;
const allPlaylistFavorites = helpers.allPlaylistFavorites;
const dateFormat = require('dateformat');

async function findPlaylist(id) {
  try {
    let playlist = await database('playlists')
      .where({ id: id });
    return playlist[0];
  } catch(e) {
    return e;
  }
}

async function allPlaylists() {
  try {
    let playlistIds = await database('playlists')
        .pluck('id');

    const promises = playlistIds.map(async (id) => {
      let favoriteInfo = await playlistInfo(id)
      return favoriteInfo
    });
    return Promise.all(promises)
  } catch (e) {
    return e;
  }
}

async function createPlaylist(title) {
  try {
    let playlist = await database('playlists')
      .insert({ title: title }, 'id')
      .returning('*');
    return playlist[0];
  } catch (e) {
    return e;
  }
}

async function updatePlaylist(id, title) {
  try {
    let playlist = await database('playlists')
      .where({ id: id })
      .update({ title: title })
      .returning('*');
    return playlist[0];
  } catch(e) {
    return e;
  }
}

async function deletePlaylist(id) {
  try {
    return await database('playlists')
      .where({ id: id })
      .del();
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
    const dateFormat = require('dateformat');


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

module.exports = {
  findPlaylist: findPlaylist,
  createPlaylist: createPlaylist,
  updatePlaylist: updatePlaylist,
  deletePlaylist: deletePlaylist,
  allPlaylists: allPlaylists
}
