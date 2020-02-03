var app = require('../../app');
const fetchSongInfo = require('../../utils/musixService');
const songJson = require('../../tests/fixtures/queenSong');
const fetch = require('node-fetch')
jest.mock('node-fetch');


describe("MusixService", () => {
  it("can fetch song details from musixmatch API", async () => {
    fetch.mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(songJson) }));

    let res = await fetchSongInfo("We Will Rock You", "Queen");
    let track = res.message.body.track;
    
    expect(res).toHaveProperty("message");
    expect(track).toHaveProperty("track_rating");
    expect(track).toHaveProperty("primary_genres");
  })
})
