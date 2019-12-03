var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const Favorite = require("../../models/favorite");


describe("Test GET favorites", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it.skip("returns a list of all favorites in the db", async () => {
    let fave_1 = new Favorite({id: 1, title: 'Thunderstruck', artistName: 'AC/DC', genre: 'Rock', rating: 98})

    let fave_2 = new Favorite({id: 2, title: 'Africa', artistName: 'Toto', genre: 'pop', rating: 100})

    await database('favorites').insert(fave_1)
    await database('favorites').insert(fave_2)

    var response = await request(app)
    .get('/api/v1/favorites')
      expect(response.status).toBe(200)
      expect(Object(response.body)).toMatchObject([fave_1, fave_2])
  });
});
