const fetch = require('node-fetch');

const fetchSongInfo = async function(title, artist) {
  try {
    let key = process.env.MUSIXMATCH_KEY;
    let url = `https://api.musixmatch.com/ws/1.1/matcher.track.get` +
      `?q_track=${title}` +
      `&q_artist=${artist}` +
      `&apikey=${key}`;
    let res = await fetch(url);
    return res;
  } catch(e) {
    return e;
  }
}

module.exports = fetchSongInfo;