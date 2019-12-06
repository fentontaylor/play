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

  it("it can create a playlist", async () => {
    const body = {
      "title": "Twistin' Grips"
    };

    const playlist = await database('playlists').first()
    expect(playlist).toBeUndefined();

    const res = await request(app)
      .post("/api/v1/playlists")
      .send(body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('title');

    const pList = await database('playlists').first();
    expect(pList.title).toBe("Twistin' Grips");
  })

  it("it returns an error", async () => {
    const body = {

    };

    const playlist = await database('playlists').first()
    expect(playlist).toBeUndefined();

    const res = await request(app)
      .post("/api/v1/playlists")
      .send(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing required attribute <title>')
  })
})
