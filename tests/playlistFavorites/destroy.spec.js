var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("DELETE /api/v1/playlists/:id/favorites/:id", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE playlist_favorites CASCADE");
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE playlist_favorites CASCADE");
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  });

  it("deletes a single playlist_favorite by id", async () => {
    await database('favorites')
      .insert({ id: 1, title: 'Keep It Real', artist_name: 'SunSquabi', genre: 'Electronic', rating: 82 })

    await database('playlists')
      .insert({ id: 1, title: 'Focus On the Task' })
    var response = await request(app)
      .delete('/api/v1/playlists/1/favorites/1')

    expect(response.status).toBe(204)
  });

  it("returns a 404 if id is not found", async () => {

    var response = await request(app)
    .delete('/api/v1/playlists/1/favorites/1')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Record not found.')
  });
});
