const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const helpers = require('../../utils/playlistFavoritesHelpers');
const createPlaylistFavorite = helpers.createPlaylistFavorite;
const allPlaylistFavorites = helpers.allPlaylistFavorites;

describe('playlistFavoritesHelpers functions', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  });

  afterEach(async () => {
    await database.raw('TRUNCATE TABLE playlist_favorites CASCADE');
    await database.raw('TRUNCATE TABLE playlists CASCADE');
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  });

  it('createPlaylistFavorite', async () => {
    let pl = await database('playlists')
      .insert({ id: 5, title: 'Looney Tunes' })
      .returning('*');

    let fav = await database('favorites')
      .insert({ id: 7, title: 'Toxic', artist_name: 'Britney Spears', genre: 'Pop', rating: 65 })
      .returning('*');

    let playlist = pl[0];
    let favorite = fav[0];

    let result = await createPlaylistFavorite(playlist.id, favorite.id)

    expect(result.playlist_id).toBe(playlist.id);
    expect(result.favorite_id).toBe(favorite.id);
  })

  it('allPlaylistFavorites', async () => {
    let pl = await database('playlists')
      .insert({ id: 5, title: 'Looney Tunes' })
      .returning('*');

    let fav1 = await database('favorites')
      .insert({ id: 7, title: 'Toxic', artist_name: 'Britney Spears', genre: 'Pop', rating: 65 })
      .returning('*');
    
    let fav2 = await database('favorites')
      .insert({ id: 8, title: 'I Want It That Way', artist_name: 'Backstreet Boys', genre: 'Pop', rating: 66 })
      .returning('*');

    let fav3 = await database('favorites')
      .insert({ id: 9, title: 'No Scrubs', artist_name: 'TLC', genre: 'Pop', rating: 67 })
      .returning('*');

    await createPlaylistFavorite(5, 7);
    await createPlaylistFavorite(5, 9);

    let result = await allPlaylistFavorites(5);

    expect(result).toEqual([fav1, fav3]);
  })
})