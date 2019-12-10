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

    let pl = await database('playlists')
      .insert({ id: 5, title: 'Looney Tunes' })
      .returning('*');

    let fav = await database('favorites')
      .insert({ id: 7, title: 'Toxic', artist_name: 'Britney Spears', genre: 'Pop', rating: 65 })
      .returning('*');
    
    playlist = pl[0];
    favorite = fav[0];
  });

  afterEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  });

  it('createPlaylistFavorite', async () => {
    let result = await createPlaylistFavorite(playlist.id, favorite.id)

    expect(result.playlist_id).toBe(playlist.id);
    expect(result.favorite_id).toBe(favorite.id);
  })
})