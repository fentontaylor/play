var shell = require('shelljs');
var request = require('supertest');
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe('PUT /api/v1/playlists/:id', () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE playlists CASCADE");
  });

  it('updates a playlist with the given id', async () => {
    await database('playlists').insert({id: 1, title: 'Looney Tunes'});

    const res = await request(app)
      .put('/api/v1/playlists/1')
      .send({ title: 'Lofi Beatz' });

    expect(res.status).toBe(200);
    
    const playlist = database('playlists')
      .where({ id: 1 })
      .columns('*')

    expect(playlist.title).toBe('Lofi Beatz')
  })
})