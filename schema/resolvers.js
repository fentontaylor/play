const fetchSongInfo = require('../utils/musixService')
const Favorite = require('../models/favorite')
const {
  favoriteSongs,
  favoriteSong,
  createFavorite,
  destroyFavorite
} = require('../utils/favoritesHelpers')

const resolvers = {
  favorites: () => {
    return favoriteSongs();
  },
  favorite: (args) => {
    return favoriteSong(args.id);
  },
  createFavorite: async (args) => {
    const data = await fetchSongInfo(args.title, args.artistName);
    if (data.message.body) {
      let fav = new Favorite(data);
      let newFavorite = await createFavorite(fav);
      return newFavorite;
    }
  },
  deleteFavorite: async (args) => {
    let result = await destroyFavorite(args.id)
    return `Deleted favorite with id: ${result}`
  }
};

module.exports = resolvers;