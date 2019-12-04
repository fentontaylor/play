var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const Favorite = require("../../models/favorite");

describe("Test DELETE favorites", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("deletes a single favorite by id", async () => {

    await database('favorites').insert({id: 1, title: 'Thunderstruck', artist_name: 'AC/DC', genre: 'Rock', rating: 98})

    var response = await request(app)
    .delete('/api/v1/favorites/1')

    expect(response.status).toBe(204)
  });

  it("returns a 404 if id is not found", async () => {

    var response = await request(app)
    .delete('/api/v1/favorites/1')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Record not found.')
  });
});
