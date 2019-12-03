var app = require("../../app");
const Favorite = require("../../models/favorite");

describe("Favorite model", ()=> {
  beforeEach(()=> {
    body = {
      "message": {
        "header": {
          "status_code": 200,
          "execute_time": 0.010143041610718,
          "confidence": 1000,
          "mode": "search",
          "cached": 1
        },
        "body": {
          "track": {
            "track_id": 161867099,
            "track_name": "We Will Rock You",
            "track_name_translation_list": [],
            "track_rating": 79,
            "commontrack_id": 92681952,
            "instrumental": 0,
            "explicit": 0,
            "has_lyrics": 1,
            "has_subtitles": 1,
            "has_richsync": 1,
            "num_favourite": 373,
            "album_id": 30782812,
            "album_name": "Greatest Hits",
            "artist_id": 118,
            "artist_name": "Queen",
            "track_share_url": "https://www.musixmatch.com/lyrics/Queen/We-Will-Rock-You-1?utm_source=application&utm_campaign=api&utm_medium=Turing%3A1409618774628",
            "track_edit_url": "https://www.musixmatch.com/lyrics/Queen/We-Will-Rock-You-1/edit?utm_source=application&utm_campaign=api&utm_medium=Turing%3A1409618774628",
            "restricted": 0,
            "updated_time": "2019-03-16T18:00:46Z",
            "primary_genres": {
              "music_genre_list": [
                {
                  "music_genre": {
                    "music_genre_id": 1146,
                    "music_genre_parent_id": 21,
                    "music_genre_name": "Arena Rock",
                    "music_genre_name_extended": "Rock / Arena Rock",
                    "music_genre_vanity": "Rock-Arena-Rock"
                  }
                },
                {
                  "music_genre": {
                    "music_genre_id": 21,
                    "music_genre_parent_id": 34,
                    "music_genre_name": "Rock",
                    "music_genre_name_extended": "Rock",
                    "music_genre_vanity": "Rock"
                  }
                }
              ]
            }
          }
        }
      }
    }
  })

  it("exists", ()=> {
    var fav = new Favorite(body);
    expect(fav).toBeInstanceOf(Favorite);
  })

  it("attributes", ()=> {
    var fav = new Favorite(body);

    expect(fav.title).toBe("We Will Rock You");
    expect(fav.artist_name).toBe("Queen");
    expect(fav.genre).toBe("Arena Rock");
    expect(fav.rating).toBe(79);
  })

  it("has default genre 'Unknown'", ()=> {
    const noGenres = {
      "message": {
        "header": {
          "status_code": 200,
          "execute_time": 0.010762929916382,
          "confidence": 1000,
          "mode": "search",
          "cached": 1
        },
        "body": {
          "track": {
            "track_id": 161867099,
            "track_name": "We Will Rock You",
            "track_name_translation_list": [],
            "track_rating": 79,
            "commontrack_id": 92681952,
            "instrumental": 0,
            "explicit": 0,
            "has_lyrics": 1,
            "has_subtitles": 1,
            "has_richsync": 1,
            "num_favourite": 373,
            "album_id": 30782812,
            "album_name": "Greatest Hits",
            "artist_id": 118,
            "artist_name": "Queen",
            "track_share_url": "https://www.musixmatch.com/lyrics/Queen/We-Will-Rock-You-1?utm_source=application&utm_campaign=api&utm_medium=Turing%3A1409618774628",
            "track_edit_url": "https://www.musixmatch.com/lyrics/Queen/We-Will-Rock-You-1/edit?utm_source=application&utm_campaign=api&utm_medium=Turing%3A1409618774628",
            "restricted": 0,
            "updated_time": "2019-03-16T18:00:46Z",
            "primary_genres": {
              "music_genre_list": []
            }
          }
        }
      }
    }
    var fav = new Favorite(noGenres);
    expect(fav.genre).toBe("Unknown");
  })
})
