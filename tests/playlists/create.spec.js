var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test POST to playlists", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
  });

  it("happy path", async () => {
    const body = {
      "title": "Twistin' Grips"
    };

    const noFavs = await database('playlists').first()
    expect(noFavs).toBeUndefined();

    const res = await request(app)
      .post("/api/v1/playlists")
      .send(body);

    expect(res.statusCode).toBe(201);
  
  })
})
