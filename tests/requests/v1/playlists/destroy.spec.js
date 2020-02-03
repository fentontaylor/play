var request = require("supertest");
var app = require('../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);

describe("DELETE /api/v1/playlists/:id", () => {
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

  it("deletes a single playlist by id", async () => {
    await database('playlists').insert({id: 1, title: 'Looney Tunes'})

    database('playlists').select()
    .then(result => {
      expect(result.length).toBe(1);
    })

    const res = await request(app).delete('/api/v1/playlists/1')

    expect(res.status).toBe(204);

    database('playlists').select()
    .then(result => {
      expect(result.length).toBe(0);
    })
  })

  it('returns status 404 if record not found', async () => {
    const res = await request(app).delete('/api/v1/playlists/8')

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Record not found' });
  })

  it('deletes related playlist_favorites when deleted', async () => {
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
    var playlists = await database('playlists').select()

    expect(playlists.length).toBe(2);

    var playlistFavorites = await database('playlist_favorites').select()

    expect(playlistFavorites).toEqual([
      { id: 1, playlist_id: 1, favorite_id: 1 },
      { id: 2, playlist_id: 2, favorite_id: 1 }
    ])

    // Delete playlist with id 1
    await request(app)
      .delete('/api/v1/playlists/1');

    // After delete: 1 playlist, 1 playlist favorite, 1 favorite
    var playlists = await database('playlists').select()

    expect(playlists.length).toBe(1);

    var playlistFavorites = await database('playlist_favorites').select()

    expect(playlistFavorites).toEqual([
      { id: 2, playlist_id: 2, favorite_id: 1 }
    ])
  })
})