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
    const noFavs = await database('favorites').first();
    expect(noFavs).toBeUndefined();

    const mutation = 'mutation{createFavorite(title: "We Will Rock You", artistName: "Queen")' +
      '{title artist_name rating genre}}';
    const res = await request(app)
      .post(`/api/v2/graphql?query=${mutation}`);

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
    expect(res.body).toEqual(expected);

    const fav = await database('favorites').first();
    expect(fav.title).toBe("We Will Rock You");
    expect(fav.artist_name).toBe("Queen");
    expect(fav.genre).toBe("Arena Rock");
    expect(fav.rating).toBe(78);
  })

  it("happy path with default genre", async () => {
    const mutation = 'mutation{createFavorite(title: "Under Pressure", artistName: "Vanilla Ice vs. Queen Bowie")' +
      '{title artist_name rating genre}}';
    const res = await request(app)
      .post(`/api/v2/graphql?query=${mutation}`);

    const fav = await database('favorites').first();
    const expected = {
      data: {
        createFavorite: {
          title: 'Under Pressure',
          artist_name: 'Vanilla Ice vs. Queen Bowie',
          rating: 78,
          genre: 'Unknown'
        }
      }
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expected);
  })

  it("sad path: missing required attribute", async () => {
    // Missing <title>
    const mutation1 = 'mutation{createFavorite(artistName: "Vanilla Ice vs. Queen Bowie")' +
      '{title artist_name rating genre}}';
    const res1 = await request(app)
      .post(`/api/v2/graphql?query=${mutation1}`);

    expect(res1.statusCode).toBe(400)
    const errorMessage1 = res1.body.errors[0].message
    expect(errorMessage1).toBe('Field "createFavorite" argument "title" of type "String!" is required, but it was not provided.')

    // Missing <artistName>
    const mutation2 = 'mutation{createFavorite(title: "Under Pressure")' +
      '{title artist_name rating genre}}';
    const res2 = await request(app)
      .post(`/api/v2/graphql?query=${mutation2}`);

    expect(res2.statusCode).toBe(400)
    const errorMessage2 = res2.body.errors[0].message
    expect(errorMessage2).toBe('Field "createFavorite" argument "artistName" of type "String!" is required, but it was not provided.')
  })
})