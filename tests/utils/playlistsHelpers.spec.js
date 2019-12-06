const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const helpers = require('../../utils/playlistsHelpers');
const findPlaylist = helpers.findPlaylist;
const deletePlaylist = helpers.deletePlaylist;
const updatePlaylist = helpers.updatePlaylist;

describe('playlistsHelpers functions', () => {
  beforeEach(async () => {
    await database.raw('TRUNCATE TABLE playlists CASCADE');

    playlist1 = await database('playlists')
      .insert({id: 1, title: 'Looney Tunes'})
      .returning('*');

    playlist2 = await database('playlists')
      .insert({id: 2, title: 'Lofi Beatz'})
      .returning('*');
  });

  afterEach(async () => {
    await database.raw('TRUNCATE TABLE playlists CASCADE');
  });

  describe('findPlaylist', () => {
    it('finds a playlist with a given id', async () => {
      const playlist = await findPlaylist(2);

      expect(playlist.id).toBe(2);
      expect(playlist.title).toBe('Lofi Beatz');
    })
  })

  describe('deletePlaylist', () => {
    it.only('deletes a playlist with a given id', async () => {
      database('playlists').select()
      .then(playlists => {
        // Playlist exists and will be deleted
        console.log(playlists)
        expect(playlists.length).toBe(2);
        expect(playlists[0].id).toBe(1);
        expect(playlists[0].title).toBe('Looney Tunes');
      })

      await deletePlaylist(1);

      database('playlists').select()
      .then(playlists => {
        expect(playlists.length).toBe(1);
        expect(playlists).toEqual(
          expect.not.arrayContaining(playlist1)
        )
      })
    })
  })

  describe('updatePlaylist', () => {
    it('updates a playlist title', async () => {
      const result = await updatePlaylist(1, 'Fancy New Title')

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
      expect(result.title).toBe('Fancy New Title');
    })
  })
})