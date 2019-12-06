const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const findPlaylist = async function(id) {
  try {
    let playlist = await database('playlists').where({ id: id })
    return playlist[0];
  } catch(e) {
    return e;
  }
}

const deletePlaylist = async function(id) {
  try {
    return await database('playlists').where({id: id}).del();
  } catch(e) {
    return e;
  }
}

module.exports = {
  findPlaylist: findPlaylist,
  deletePlaylist: deletePlaylist
}