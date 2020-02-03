var request = require("supertest");
var app = require('../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test /api/v2/graphql mutation deleteFavorite", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE playlist_favorites CASCADE");
    await database.raw("TRUNCATE TABLE playlists CASCADE");
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE playlist_favorites CASCADE");
    await database.raw("TRUNCATE TABLE playlists CASCADE");
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("deletes a single favorite by id", async () => {

    await database('favorites')
      .insert({ id: 1, title: 'Thunderstruck', artist_name: 'AC/DC', genre: 'Rock', rating: 98 });

    var favorites = await database('favorites');
    expect(favorites.length).toBe(1);

    const query = 'mutation{deleteFavorite(id: 1)}'
    const response = await request(app)
      .post(`/api/v2/graphql?query=${query}`);

    favorites = await database('favorites');
    expect(favorites.length).toBe(0);

    const expected = { data: { deleteFavorite: 'Deleted favorite with id: 1' } }
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expected);
  });

  it("returns null data if id is not found", async () => {
    const query = 'mutation{deleteFavorite(id: 100)}'
    const response = await request(app)
      .post(`/api/v2/graphql?query=${query}`);

    const errorMessage = response.body.errors[0];
    expect(errorMessage.statusCode).toBe(404);
    expect(errorMessage.message).toBe("Record not found with provided ID.");
  });
});
