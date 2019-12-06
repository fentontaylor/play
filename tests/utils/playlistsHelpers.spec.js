const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const helpers = require('../../utils/playlistsHelpers');
const findPlaylist = helpers.findPlaylist;

describe("playlistsHelpers functions", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
    await database('playlists').insert({id: 1, title: 'Looney Tunes'});
    await database('playlists').insert({id: 2, title: 'Lofi Beatz'});
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
  });

  describe("findPlaylist", () => {
    it("finds a playlist with a given id", async () => {
      const playlist = await findPlaylist(2);

      expect(playlist.id).toBe(2);
      expect(playlist.title).toBe('Lofi Beatz');
    })
  })
})