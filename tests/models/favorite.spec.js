var app = require("../../app");
const Favorite = require("../../models/favorite");
const songJson = require('../fixtures/queenSong');
const songJsonNoGenres = require('../fixtures/queenSongNoGenres');

describe("Favorite model", ()=> {
  beforeEach(()=> {
    body = songJson
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
    expect(fav.rating).toBe(78);
  })

  it("has default genre 'Unknown'", ()=> {
    var fav = new Favorite(songJsonNoGenres);
    expect(fav.genre).toBe("Unknown");
  })
})
