const fetch = require('node-fetch');
const queenSong = require('../../tests/fixtures/queenSong')

fetchSongInfo = async function (title, artist) {
  return Promise.resolve(queenSong);
}

module.exports = fetchSongInfo;