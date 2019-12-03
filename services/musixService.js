const fetch = require('node-fetch');

class MusixService {
  constructor(title, artist) {
    this.songTitle = title,
    this.artistName = artist
  }

  async fetchSongInfo() {

  }
}

module.exports = MusixService;