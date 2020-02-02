var request = require("supertest");
var app = require('../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test DELETE favorites", () => {
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

    await database('favorites').insert({id: 1, title: 'Thunderstruck', artist_name: 'AC/DC', genre: 'Rock', rating: 98})

    var response = await request(app)
      .delete('/api/v1/favorites/1')
      
    expect(response.status).toBe(204)
  });

  it("returns a 404 if id is not found", async () => {

    var response = await request(app)
    .delete('/api/v1/favorites/1')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Record not found.')
  });

  it('deletes related playlist favorites when deleted', async () => {
    await database('playlists').insert([
      { id: 1, title: 'Jams' },
      { id: 2, title: 'Beats' }
    ]);

    await database('favorites').insert(
      {
        id: 1,
        title: 'Under Pressure',
        artist_name: 'Queen',
        genre: 'Rock',
        rating: 75
      }
    );

    await database('playlist_favorites').insert([
      { id: 1, playlist_id: 1, favorite_id: 1 },
      { id: 2, playlist_id: 2, favorite_id: 1 }
    ]);

    // Before delete: 2 playlists, 2 playlist_favorites, 1 favorite
    var favorites = await database('favorites');

    expect(favorites.length).toBe(1);

    var playlistFavorites = await database('playlist_favorites');

    expect(playlistFavorites).toEqual([
      { id: 1, playlist_id: 1, favorite_id: 1 },
      { id: 2, playlist_id: 2, favorite_id: 1 }
    ])

    // Delete favorite with id 1
    await request(app)
      .delete('/api/v1/favorites/1');

    // After delete: 2 playlists, 0 playlist favorites, 0 favorites
    var favorites = await database('favorites');

    expect(favorites.length).toBe(0);

    var playlistFavorites = await database('playlist_favorites');

    expect(playlistFavorites).toEqual([]);
  })
});
