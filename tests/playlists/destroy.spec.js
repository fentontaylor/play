var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("DELETE /api/v1/playlists/:id", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
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
})