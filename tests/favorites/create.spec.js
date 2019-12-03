var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test POST to favorites", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("happy path", async () => {
    const body = {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 88
    }

    const noFavs = await database('favorites').first()
    expect(noFavs).toBeUndefined();

    const res = await request(app)
      .post("/api/v1/favorites")
      .send(body);

    expect(res.statusCode).toBe(201);

    const fav = await database('favorites').first();
    expect(fav.title).toBe(body.title);
    expect(fav.artist_name).toBe(body.artistName);
    expect(fav.genre).toBe(body.genre);
    expect(fav.rating).toBe(body.rating);
  })
})