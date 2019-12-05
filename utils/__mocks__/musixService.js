const queenSong = require('../../tests/fixtures/queenSong');
const queenSongNoGenres = require('../../tests/fixtures/queenSongNoGenres');

fetchSongInfo = async function (title, artist) {
  if (title == "We Will Rock You") {
    return Promise.resolve(queenSong);
  } else {
    return Promise.resolve(queenSongNoGenres);
  }
}

module.exports = fetchSongInfo;