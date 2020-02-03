const FormatError = require('easygraphql-format-error');

const formatError = new FormatError([
  {
    name: 'FAVORITE_NOT_FOUND',
    message: 'Record not found with provided ID.',
    statusCode: 404
  }
])

module.exports = formatError;
