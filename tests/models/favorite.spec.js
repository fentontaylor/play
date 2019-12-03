var app = require("../../app");
const Favorite = require("../../models/favorite");

describe("Favorite model", ()=> {
  it("exists", ()=> {
    const body = {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 88
    }
    var fav = new Favorite(body);
    expect(fav).toBeInstanceOf(Favorite);
  })

  it("attributes", ()=> {
    const body = {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 88
    }
    var fav = new Favorite(body);

    expect(fav.title).toBe(body.title);
    expect(fav.artist_name).toBe(body.artistName);
    expect(fav.genre).toBe(body.genre);
    expect(fav.rating).toBe(body.rating);
  })

  it("has default genre 'Unknown'", ()=> {
    const body = {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen",
      "rating": 88
    }
    var fav = new Favorite(body);
    expect(fav.genre).toBe("Unknown");
  })
})
