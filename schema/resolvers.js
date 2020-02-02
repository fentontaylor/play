const {
  favoriteSongs,
  favoriteSong
} = require('../utils/favoritesHelpers')

const resolvers = {
  favorites: () => {
    return favoriteSongs();
  },
  favorite: (args) => {
    return favoriteSong(args.id)
  }
};

module.exports = resolvers;