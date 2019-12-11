var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

jest.mock('../../utils/musixService');

describe("Test POST to favorites", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("happy path", async () => {
    const body = {
      "title": "We Will Rock You",
      "artistName": "Queen"
    };

    const noFavs = await database('favorites').first()
    expect(noFavs).toBeUndefined();

    const res = await request(app)
      .post("/api/v1/favorites")
      .send(body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('artist_name');
    expect(res.body).toHaveProperty('genre');
    expect(res.body).toHaveProperty('rating');

    const fav = await database('favorites').first();
    expect(fav.title).toBe("We Will Rock You");
    expect(fav.artist_name).toBe("Queen");
    expect(fav.genre).toBe("Arena Rock");
    expect(fav.rating).toBe(78);
  })

  it("happy path with default genre", async () => {
    const body = {
      "title": "Under Pressure",
      "artistName": "Vanilla Ice vs. Queen Bowie"
    };

    const res = await request(app)
      .post("/api/v1/favorites")
      .send(body);

    const fav = await database('favorites').first();

    expect(res.statusCode).toBe(201);
    expect(fav.genre).toBe("Unknown");
  })

  it("sad path: missing required attribute", async () => {
    // Missing <title>
    var body = {
      "artistName": "Queen",
    };

    const res1 = await request(app)
      .post("/api/v1/favorites")
      .send(body);

    expect(res1.statusCode).toBe(400)
    expect(res1.body).toEqual({ error: 'Missing required attribute <title>' })

    // Missing <artistName>
    var body = {
      "title": "We Will Rock You"
    };

    const res2 = await request(app)
      .post("/api/v1/favorites")
      .send(body);

    expect(res2.statusCode).toBe(400)
    expect(res2.body).toMatchObject({ error: 'Missing required attribute <artistName>' })
  })

  it("sad path: empty search result from musixmatch API", async () => {
    var body = {
      "title": "asdfasdf",
      "artistName": "qazwsx"
    }

    const res = await request(app)
      .post('/api/v1/favorites')
      .send(body);
    
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "No search results for title: 'asdfasdf', artistName: 'qazwsx'"})
  })
})