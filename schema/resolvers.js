const fetchSongInfo = require('../utils/musixService');
const Favorite = require('../models/favorite');
const {
  favoriteSongs,
  favoriteSong,
  createFavorite,
  destroyFavorite
} = require('../utils/favoritesHelpers');

const resolvers = {
  favorites: () => {
    return favoriteSongs();
  },

  favorite: async (args, { errorName }) => {
    const result = await favoriteSong(args.id);
    if (result === undefined) {
      throw new Error(errorName.FAVORITE_NOT_FOUND)
    }
    return result
  },

  createFavorite: async (args) => {
    const data = await fetchSongInfo(args.title, args.artistName);
    if (data.message.body) {
      const fav = new Favorite(data);
      const newFavorite = await createFavorite(fav);
      return newFavorite;
    }
  },

  deleteFavorite: async (args, { errorName }) => {
    const result = await destroyFavorite(args.id);
    if (result === 0) {
      throw new Error(errorName.FAVORITE_NOT_FOUND);
    }
    return `Deleted favorite with id: ${result}`;
  }
};

module.exports = resolvers;