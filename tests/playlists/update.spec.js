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
    
    const playlist = await database('playlists')
      .where({ id: 1 })
      .columns('*');

    expect(playlist[0].title).toBe('Lofi Beatz')
  })

  it('returns 404 if playlist not found by id', async () => {
    const res = await request(app)
      .put('/api/v1/playlists/1')
      .send({ title: 'Lofi Beatz' });
    
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Record not found' });
  })

  it('returns 400 if title not provided', async () => {
    let res1 = await request(app)
      .put('/api/v1/playlists/1')

    expect(res1.status).toBe(400);
    expect(res1.body).toEqual({ error: 'Missing required attribute <title>' });

    let res2 = await request(app)
      .put('/api/v1/playlists/1')
      .send({ title: '' });

    expect(res2.status).toBe(400);
    expect(res2.body).toEqual({ error: 'Missing required attribute <title>' });

    let res3 = await request(app)
      .put('/api/v1/playlists/1')
      .send({ title: 0 });

    expect(res3.status).toBe(400);
    expect(res3.body).toEqual({ error: 'Missing required attribute <title>' });
  })
})