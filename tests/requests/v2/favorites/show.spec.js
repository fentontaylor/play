var request = require("supertest");
var app = require('../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test /api/v2/graphql query favorite", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("returns a single favorite by id", async () => {

    const song1 = await database('favorites')
      .insert({ id: 1, title: 'Thunderstruck', artist_name: 'AC/DC', genre: 'Rock', rating: 98 })
      .returning(['id', 'title', 'artist_name', 'genre', 'rating'])

    const song2 = await database('favorites')
      .insert({ id: 2, title: 'Africa', artist_name: 'Toto', genre: 'pop', rating: 100 })
      .returning(['id', 'title', 'artist_name', 'genre', 'rating'])

    const query1 = 'query{favorite(id: 1){id title artist_name genre rating}}'
    const response1 = await request(app)
      .post(`/api/v2/graphql?query=${query1}`)

    const expected1 = {
      data: {
        favorite: song1[0]
      }
    }

    expect(response1.status).toBe(200)
    expect(response1.body).toEqual(expected1)

    const query2 = 'query{favorite(id: 2){id title artist_name genre rating}}'
    const response2 = await request(app)
      .post(`/api/v2/graphql?query=${query2}`)

    const expected2 = {
      data: {
        favorite: song2[0]
      }
    }

    expect(response2.status).toBe(200)
    expect(response2.body).toEqual(expected2)
  });

  it("returns custom error if id is not found", async () => {
    const query = 'query{favorite(id: 100){id title artist_name genre rating}}'
    const response = await request(app)
      .post(`/api/v2/graphql?query=${query}`)

    const errorMessage = response.body.errors[0];

    expect(errorMessage.statusCode).toBe(404);
    expect(errorMessage.message).toBe("Record not found with provided ID.");
  });
});
