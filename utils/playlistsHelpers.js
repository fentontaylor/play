const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const findPlaylist = async function(id) {
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

const deletePlaylist = async function(id) {
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
  createPlaylist: createPlaylist,
  updatePlaylist: updatePlaylist,
  deletePlaylist: deletePlaylist,
  allPlaylists: allPlaylists
}
