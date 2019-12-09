const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const helpers = require('../../utils/playlistFavoritesHelpers');
const createPlaylistFavorite = helpers.createPlaylistFavorite;

describe('playlistFavoritesHelpers functions', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');

    playlist1 = await database('playlists')
      .insert({ id: 5, title: 'Looney Tunes' })
      .returning('*');

    favorite1 = await database('playlists')
      .insert({ id: 7, title: 'Toxic', artist_name: 'Britney Spears', genre: 'Pop', rating: 65 })
      .returning('*');
  });

  afterEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  });

  it('createPlaylistFavorite', async () => {
    let result = await createPlaylistFavorite(1, 1)

    expect(result.playlist_id).toBe(5);
    expect(result.favorite_id).toBe(7);
  })
})