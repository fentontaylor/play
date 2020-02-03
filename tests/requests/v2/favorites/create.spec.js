var request = require("supertest");
var app = require('../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

jest.mock('../../../../utils/musixService');

describe("Test /api/v2/graphql mutation createFavorite", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("happy path", async () => {
    const noFavs = await database('favorites').first()
    expect(noFavs).toBeUndefined();

    const mutation = 'mutation{createFavorite(title: "We Will Rock You", artistName: "Queen")' +
      '{title artist_name rating genre}}'
    const res = await request(app)
      .post(`/api/v2/graphql?query=${mutation}`)
    console.log(res.body)
    const expected = {
      data: {
        createFavorite: {
          title: 'We Will Rock You',
          artist_name: 'Queen',
          rating: 78,
          genre: 'Arena Rock'
        }
      }
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expected)

    const fav = await database('favorites').first();
    expect(fav.title).toBe("We Will Rock You");
    expect(fav.artist_name).toBe("Queen");
    expect(fav.genre).toBe("Arena Rock");
    expect(fav.rating).toBe(78);
  })

  it.skip("happy path with default genre", async () => {
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

  it.skip("sad path: missing required attribute", async () => {
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

  it.skip("sad path: empty search result from musixmatch API", async () => {
    var body = {
      "title": "asdfasdf",
      "artistName": "qazwsx"
    }

    const res = await request(app)
      .post('/api/v1/favorites')
      .send(body);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "No search results for title: 'asdfasdf', artistName: 'qazwsx'" })
  })
})