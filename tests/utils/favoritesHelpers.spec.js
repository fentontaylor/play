const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const helpers = require('../../utils/favoritesHelpers');
const favoriteSongs = helpers.favoriteSongs;
const favoriteSong = helpers.favoriteSong;
const createFavorite = helpers.createFavorite;
const destroyFavorite = helpers.destroyFavorite;


describe('favoritesHelpers functions', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE favorites CASCADE');

    let fave1 = await database('favorites')
      .insert({id: 1, title: 'Thunderstruck', artist_name: 'AC/DC', genre: 'Rock', rating: 98})
      .returning(['id', 'title', 'artist_name', 'genre', 'rating'])

    let fave2 = await database('favorites')
      .insert({id: 2, title: 'Africa', artist_name: 'Toto', genre: 'pop', rating: 100})
      .returning(['id', 'title', 'artist_name', 'genre', 'rating'])

  });

  afterEach(async () => {
    await database.raw('TRUNCATE TABLE favorites CASCADE');
  })

  describe('favoriteSongs', () => {
    it('returns a list of all favorite songs', async () => {
      const favorites = await favoriteSongs();
      expect(favorites.length).toBe(2);
      expect(favorites[0].id).toBe(1);
      expect(favorites[0].title).toBe('Thunderstruck');
      expect(favorites[0].artist_name).toBe('AC/DC');
      expect(favorites[0].genre).toBe('Rock');
      expect(favorites[0].rating).toBe(98);
      expect(favorites[1].title).toBe('Africa')
    })
  })

  describe('favoriteSong', () => {
    it('returns a single favorite song by id', async () => {
      const favorite = await favoriteSong(2);
      expect(favorite.id).toBe(2);
      expect(favorite.title).toBe('Africa');
      expect(favorite.artist_name).toBe('Toto');
      expect(favorite.genre).toBe('pop');
      expect(favorite.rating).toBe(100);
    })
  })

  describe('createFavorite', () => {
    it('creates a new favorite in the database', async () => {
      var fave = {
        id: 3,
        title: 'We Will Rock You',
        artist_name: 'Queen',
        genre: 'Arena Rock',
        rating: 78
      };

      const newFavorite = await createFavorite(fave)

      expect(newFavorite.title).toBe('We Will Rock You');
      expect(newFavorite.artist_name).toBe('Queen');
      expect(newFavorite.genre).toBe('Arena Rock');
      expect(newFavorite.rating).toBe(78);
    })
  })

  describe('destroyFavorite', () => {
    it('deletes a favorite from the database', async() => {
      var favorites = await favoriteSongs();
      expect(favorites[0].id).toBe(1);
      expect(favorites[0].title).toBe('Thunderstruck');
      expect(favorites[0].artist_name).toBe('AC/DC');
      expect(favorites[0].genre).toBe('Rock');
      expect(favorites[0].rating).toBe(98);
      expect(favorites[1].title).toBe('Africa')

      await destroyFavorite(1)
      var postDestroyFavorites = await favoriteSongs()

      expect(postDestroyFavorites[0].id).toBe(2);
      expect(postDestroyFavorites[0].title).toBe('Africa');
      expect(postDestroyFavorites[0].artist_name).toBe('Toto');
      expect(postDestroyFavorites[0].genre).toBe('pop');
      expect(postDestroyFavorites[0].rating).toBe(100);
      expect(postDestroyFavorites[1]).toBeUndefined();
    })
  })
})
