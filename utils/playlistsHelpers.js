const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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
    return await database('playlists')
      .columns('*');
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
}
