const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const helpers = require('./playlistFavoritesHelpers');
const { playlistInfo } = helpers;

async function findPlaylist(id) {
  try {
    let playlist = await database('playlists')
      .where({ id: id });
    return playlist[0];
  } catch(e) {
    return e;
  }
}

async function findPlaylistByTitle(title) {
  try {
    return await database('playlists')
      .where('title', title)
      .first()
  } catch(e) {
    return e;
  }
}

async function allPlaylists() {
  try {
    let playlistIds = await database('playlists')
      .pluck('id');
    const promises = playlistIds.map(async (id) => {
      return await playlistInfo(id)
    });
    return Promise.all(promises);
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

module.exports = {
  findPlaylist: findPlaylist,
  findPlaylistByTitle: findPlaylistByTitle,
  createPlaylist: createPlaylist,
  updatePlaylist: updatePlaylist,
  deletePlaylist: deletePlaylist,
  allPlaylists: allPlaylists
};
