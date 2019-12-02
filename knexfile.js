// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/play_dev',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/play_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgres://mtzrtdvtipcjwx:a205bc768c4d0c9c35860bf5280f62ab0e899ae9469f24e6df9850717e608c68@ec2-174-129-253-86.compute-1.amazonaws.com:5432/d8qj2c75qm2ra3',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
