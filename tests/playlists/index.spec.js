var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test GET playlists", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
  });

  it("returns a list of all playlists in the db", async () => {
    let playlist1 = await database('playlists')
      .insert({id: 1, title: 'Rock Your Socks Off'})
      .returning('*')

    let playlist2 = await database('playlists')
      .insert({id: 2, title: 'Wake Up Jams'})
      .returning('*')

    var response = await request(app)
    .get('/api/v1/playlists')
      expect(response.status).toBe(200)
      expect(response.body[0].id).toBe(1)
      expect(response.body[0].title).toBe('Rock Your Socks Off')
      expect(response.body[1].id).toBe(2)
      expect(response.body[1].title).toBe('Wake Up Jams')
  });
});
