var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test GET favorites", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("returns a list of all favorites in the db", async () => {
    let fave1 = await database('favorites')
      .insert({id: 1, title: 'Thunderstruck', artist_name: 'AC/DC', genre: 'Rock', rating: 98})
      .returning(['id', 'title', 'artist_name', 'genre', 'rating'])

    let fave2 = await database('favorites')
      .insert({id: 2, title: 'Africa', artist_name: 'Toto', genre: 'pop', rating: 100})
      .returning(['id', 'title', 'artist_name', 'genre', 'rating'])

    var response = await request(app)
    .get('/api/v1/favorites')
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject([fave1[0], fave2[0]])
  });
});
