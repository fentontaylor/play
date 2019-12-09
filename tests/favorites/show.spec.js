var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test GET favorites/:id", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("returns a single favorite by id", async () => {

    await database('favorites').insert({id: 1, title: 'Thunderstruck', artist_name: 'AC/DC', genre: 'Rock', rating: 98})

    await database('favorites').insert({id: 2, title: 'Africa', artist_name: 'Toto', genre: 'pop', rating: 100})

    var response = await request(app)
    .get('/api/v1/favorites/1')

    expect(response.status).toBe(200)
    expect(response.body.artist_name).toBe('AC/DC')
    expect(response.body.title).toBe('Thunderstruck')

    var response = await request(app)
    .get('/api/v1/favorites/2')

    expect(response.status).toBe(200)
    expect(response.body.artist_name).toBe('Toto')
    expect(response.body.title).toBe('Africa')
  });

  it("returns a 404 if id is not found", async () => {

    var response = await request(app)
    .get('/api/v1/favorites/1')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Record not found.')
  });
});
