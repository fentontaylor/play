class Favorite {
  constructor(obj) {
    this.title = obj.title,
    this.artist_name = obj.artistName,
    this.genre = obj.genre || 'Unknown',
    this.rating = obj.rating
  }
}

module.exports = Favorite;