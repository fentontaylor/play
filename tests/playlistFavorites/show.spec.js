var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const helpers = require('../../utils/playlistFavoritesHelpers');
const createPlaylistFavorite = helpers.createPlaylistFavorite;
const dateFormat = require('dateformat');

describe('GET /api/v1/playlists/:playlistId/favorites', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  })

  afterEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  })

  it('returns playlist data including songCount, songAvgRating, and favorites', async () => {
    let pl = await database('playlists')
      .insert({ id: 1, title: 'Cleaning House' })
      .returning('*');

    let fav1 = await database('favorites')
      .insert({ id: 1, title: 'We Will Rock You', artist_name: 'Queen', genre: 'Rock', rating: 25 })
      .returning('*');

    let fav4 = await database('favorites')
      .insert({ id: 4, title: 'Back in Black', artist_name: 'AC/DC', genre: 'Rock', rating: 30 })
      .returning('*');

    await createPlaylistFavorite(1, 1);
    await createPlaylistFavorite(1, 4);

    let expected = {
      "id": 1,
      "title": "Cleaning House",
      "songCount": 2,
      "songAvgRating": 27.5,
      "favorites": [
        {
          "id": 1,
          "title": "We Will Rock You",
          "artist_name": "Queen",
          "genre": "Rock",
          "rating": 25
        },
        {
          "id": 4,
          "title": "Back in Black",
          "artist_name": "AC/DC",
          "genre": "Rock",
          "rating": 30
        }
      ],
      "createdAt": dateFormat(pl[0].created_at, "isoDateTime"),
      "updatedAt": dateFormat(pl[0].updated_at, "isoDateTime")
    }

    let result = await request(app)
      .get('/api/v1/playlists/1/favorites');

    expect(result.status).toBe(200);
    expect(result.body).toEqual(expected);
  })
})