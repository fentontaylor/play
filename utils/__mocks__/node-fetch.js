const songJson = require('../../tests/fixtures/queenSong');

const fetch = async function(url) {
  return Promise.resolve(songJson);
}
module.exports = fetch;