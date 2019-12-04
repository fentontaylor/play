const fetch = require('node-fetch');

class MusixService {
  constructor(title, artist) {
    this.key = process.env.MUSIXMATCH_KEY,
    this.url = `https://api.musixmatch.com/ws/1.1/matcher.track.get` +
      `?q_track=${title}` +
      `&q_artist=${artist}` +
      `&apikey=${this.key}`
  }

  async fetchSongInfo() {
    try {
      let res = await fetch(this.url);
      let json = await res.json();
      return json;
    } catch(e) {
      return e;
    }
  }
}

module.exports = MusixService;