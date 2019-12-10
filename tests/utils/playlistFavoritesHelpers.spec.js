const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const helpers = require('../../utils/playlistFavoritesHelpers');
const createPlaylistFavorite = helpers.createPlaylistFavorite;
const allPlaylistFavorites = helpers.allPlaylistFavorites;
const countFavorites = helpers.countFavorites;
const songAvgRating = helpers.songAvgRating;
const playlistInfo = helpers.playlistInfo;

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

  it('countFavorites', async () => {
    await database('playlists')
      .insert({ id: 5, title: 'Looney Tunes' })

    await database('favorites')
      .insert({ id: 7, title: 'Toxic', artist_name: 'Britney Spears', genre: 'Pop', rating: 65 })
    
    await createPlaylistFavorite(5, 7);

    var songCount = await countFavorites(5);
    expect(songCount).toBe(1);

    await database('favorites')
      .insert({ id: 8, title: 'I Want It That Way', artist_name: 'Backstreet Boys', genre: 'Pop', rating: 66 })

    await database('favorites')
      .insert({ id: 9, title: 'No Scrubs', artist_name: 'TLC', genre: 'Pop', rating: 75 })

    await createPlaylistFavorite(5, 8);
    await createPlaylistFavorite(5, 9);

    var songCount = await countFavorites(5);
    expect(songCount).toBe(3);
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
      .insert({ id: 9, title: 'No Scrubs', artist_name: 'TLC', genre: 'Pop', rating: 75 })
      .returning('*');

    await createPlaylistFavorite(5, 7);
    await createPlaylistFavorite(5, 9);

    let result = await allPlaylistFavorites(5);
    let expected = [{
      id: 7,
      title: 'Toxic',
      artist_name: 'Britney Spears',
      genre: 'Pop',
      rating: 65
    },
    {
      id: 9,
      title: 'No Scrubs',
      artist_name: 'TLC',
      genre: 'Pop',
      rating: 75
    }]

    expect(result).toEqual(expected);
  })

  it('songAvgRating', async () => {
    let pl = await database('playlists')
      .insert({ id: 5, title: 'Looney Tunes' })
      .returning('*');

    let fav1 = await database('favorites')
      .insert({ id: 7, title: 'Toxic', artist_name: 'Britney Spears', genre: 'Pop', rating: 65 })
      .returning('*');

    let fav3 = await database('favorites')
      .insert({ id: 9, title: 'No Scrubs', artist_name: 'TLC', genre: 'Pop', rating: 70 })
      .returning('*');

    await createPlaylistFavorite(5, 7);
    await createPlaylistFavorite(5, 9);

    let avg = await songAvgRating(5);

    expect(avg).toBe(67.50);
  })

  it('playlistInfo', async () => {
    let pl = await database('playlists')
      .insert({ id: 1, title: 'Cleaning House' })
      .returning('*');

    let fav1 = await database('favorites')
      .insert({ id: 1, title: 'We Will Rock You', artist_name: 'Queen', genre: 'Rock', rating: 25 })
      .returning('*');

    let fav3 = await database('favorites')
      .insert({ id: 4, title: 'Back in Black', artist_name: 'AC/DC', genre: 'Rock', rating: 30 })
      .returning('*');

    await createPlaylistFavorite(1, 1);
    await createPlaylistFavorite(1, 4);

    let result = await playlistInfo(1);

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
      "createdAt": pl[0].created_at,
      "updatedAt": pl[0].updated_at
    }

    expect(result).toEqual(expected);
  })
})