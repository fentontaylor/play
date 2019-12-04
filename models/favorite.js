class Favorite {
  constructor(obj) {
    this.title = obj.message.body.track.track_name,
    this.artist_name = obj.message.body.track.artist_name,
    this.genre = this.getGenre(obj),
    this.rating = obj.message.body.track.track_rating
  }

  getGenre(obj) {
    let genreObject = obj.message.body.track.primary_genres.music_genre_list[0];

    if (genreObject) {
      return genreObject.music_genre.music_genre_name;
    } else {
      return 'Unknown';
    }
  }
}

module.exports = Favorite;