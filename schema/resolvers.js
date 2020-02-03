const fetchSongInfo = require('../utils/musixService');
const Favorite = require('../models/favorite');
// const FormatError = require('easygraphql-format-error');
const {
  favoriteSongs,
  favoriteSong,
  createFavorite,
  destroyFavorite
} = require('../utils/favoritesHelpers');

// const favNotFoundError = new FormatError([
//   {
//     name: 'FAVORITE_NOT_FOUND',
//     message: 'Record not found with provided ID.',
//     statusCode: 404
//   }
// ])
// const errorName = favNotFoundError.errorName

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
  deleteFavorite: async (args, { errorName }) => {
    let result = await destroyFavorite(args.id);
    if (result === 0) {
      throw new Error(errorName.FAVORITE_NOT_FOUND);
    } else {
      return `Deleted favorite with id: ${result}`;
    }
  }
};

module.exports = resolvers;