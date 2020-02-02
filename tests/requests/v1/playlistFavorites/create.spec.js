var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe('POST /api/v1/playlists/:id/favorites/:id', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');

    await database('favorites')
      .insert({ id: 1, title: 'Under Pressure', artist_name: 'Queen', genre: 'Rock', rating: 75 })

    await database('playlists')
      .insert({ id: 1, title: 'Jams' })
  })

  afterEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  })

  it('creates a new playlist_favorite from request params', async () => {
    const res = await request(app)
      .post('/api/v1/playlists/1/favorites/1');

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: "Under Pressure has been added to Jams!" })
  })

  it("sad path: returns 400 if it can't find playlist", async () => {
    const res = await request(app)
      .post('/api/v1/playlists/2/favorites/1');
    
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Could not create record with playlist_id: 2, favorite_id: 1' })
  })

  it("sad path: returns 400 if it can't find favorite", async () => {
    const res = await request(app)
      .post('/api/v1/playlists/1/favorites/2');

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Could not create record with playlist_id: 1, favorite_id: 2' })
  })

  it("sad path: returns 409 if favorite already exists", async () => {
    await database('playlist_favorites')
      .insert({ playlist_id: 1, favorite_id: 1 });
    
    const res = await request(app)
      .post('/api/v1/playlists/1/favorites/1');

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      "error": "Record already exists with playlist_id: 1, favorite_id: 1"
    })
  })
})