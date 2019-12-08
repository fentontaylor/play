const queenSong = require('../../tests/fixtures/queenSong');
const queenSongNoGenres = require('../../tests/fixtures/queenSongNoGenres');
const emptySearchResult = require('../../tests/fixtures/emptySearchResult');

fetchSongInfo = async function (title, artist) {
  if (title === "We Will Rock You") {
    return Promise.resolve(queenSong);
  } else if (title === 'Under Pressure') {
    return Promise.resolve(queenSongNoGenres);
  } else {
    return Promise.resolve(emptySearchResult);
  }
}

module.exports = fetchSongInfo;