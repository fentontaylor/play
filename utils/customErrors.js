const FormatError = require('easygraphql-format-error');

const formatError = new FormatError([
  {
    name: 'FAVORITE_NOT_FOUND',
    message: 'Record not found with provided ID.',
    statusCode: 404
  },
  {
    name: 'EMPTY_SONG_DATA',
    message: "Could not fetch song data with given 'title' and 'artistName'.",
    statusCode: 400
  }
])

module.exports = formatError;
