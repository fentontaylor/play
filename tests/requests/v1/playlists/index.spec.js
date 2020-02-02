var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test GET playlists", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE playlist_favorites CASCADE");
    await database.raw("TRUNCATE TABLE playlists CASCADE");
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE playlist_favorites CASCADE");
    await database.raw("TRUNCATE TABLE playlists CASCADE");
    await database.raw("TRUNCATE TABLE favorites CASCADE");  });

  it("returns a list of all playlists in the db", async () => {
    await database('favorites')
      .insert({ id: 1, title: 'Keep It Real', artist_name: 'SunSquabi', genre: 'Electronic', rating: 82 })

    await database('favorites')
      .insert({ id: 2, title: 'Open Rythms', artist_name: 'Bodies Of Water', genre: 'Indie', rating: 82 })

    await database('playlists')
      .insert({ id: 1, title: 'Focus On the Task' })

    await database('playlists')
      .insert({ id: 2, title: 'Sample Playlist' })

    await database('playlist_favorites')
      .insert({ id: 1, playlist_id: 1, favorite_id: 1 })

    await database('playlist_favorites')
      .insert({ id: 2, playlist_id: 2, favorite_id: 1 })

    await database('playlist_favorites')
      .insert({ id: 3, playlist_id: 2, favorite_id: 2 })

    var response = await request(app)
      .get('/api/v1/playlists')

    expect(response.body.length).toBe(2)
    expect(response.body[1].favorites.length).toBe(2)
    expect(response.body[0].title).toEqual("Focus On the Task")
    expect(response.body[1].favorites[0].title).toEqual("Keep It Real")
    expect(response.body[1].favorites[1].title).toEqual("Open Rythms")
  });
});