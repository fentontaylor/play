const { buildSchema } = require('graphql')
const { favoriteSongs } = require('../utils/favoritesHelpers')

var schema = buildSchema(`
  type Favorite {
    id: Int
    title: String!
    artist_name: String!
    genre: String
    rating: Int
  }

  type Query {
    favorites: [Favorite]
  }
`);

var root = {
  favorites: () => {
    return favoriteSongs();
  }
};

module.exports = {
  schema: schema,
  root: root
}
