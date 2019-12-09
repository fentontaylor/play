const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

async function favoriteSongs() {
  try {
    return await database('favorites')
      .column(['id', 'title', 'artist_name', 'genre', 'rating'])
  } catch (e) {
    return e;
  }
}

async function favoriteSong(songId) {
  try {
    let favorite =  await database('favorites')
      .where({ id: songId })
      .column(['id', 'title', 'artist_name', 'genre', 'rating'])
    return favorite[0];
  } catch (e) {
    return e;
  }
}

async function createFavorite(fav) {
  try {
    let favorite =  await database('favorites')
      .insert(fav, 'id')
      .returning(['id', 'title', 'artist_name', 'genre', 'rating'])
    return favorite[0];
  } catch(e) {
    return e;
  }
}

async function seekAndDestroy(targetId) {
  try {
    return await database('favorites').where({ id: targetId }).del()
  } catch (e) {
    return e;
  }
}

module.exports = {
  favoriteSongs: favoriteSongs,
  favoriteSong: favoriteSong,
  createFavorite: createFavorite,
  seekAndDestroy: seekAndDestroy
}