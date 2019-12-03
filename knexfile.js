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
  staging: {
    client: 'pg',
    connection: 'postgres://fmmgjuscqdudrf:54651ac2fb92f4c81dbde7ac060e7550469c6eb92ad5af5ae41a68d562b70555@ec2-174-129-255-46.compute-1.amazonaws.com:5432/dchle8rhf9bbqg',
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
