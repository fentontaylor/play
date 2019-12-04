var app = require('../../app');
const MusixService = require('../../services/musixService');
const songJson = require('../fixtures/queenSong');

describe("MusixService", ()=> {
  it("can initialize", ()=> {
    let service = new MusixService("We Will Rock You", "Queen");

    expect(service).toBeInstanceOf(MusixService);
  })

  it("can fetch song details from musixmatch API", async ()=> {
    let service = await new MusixService("We Will Rock You", "Queen");
    service.fetchSongInfo = jest.fn().mockImplementation(() => {
      return Promise.resolve(songJson)
    })
    let res = await service.fetchSongInfo();
    
    let track = res.message.body.track;
    
    expect(res).toHaveProperty("message");
    expect(track).toHaveProperty("track_rating");
    expect(track).toHaveProperty("primary_genres");
  })
})
