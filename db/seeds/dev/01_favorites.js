exports.seed = function(knex) {
  return knex('favorites').del()
  .then(() => {
    return knex('favorites').insert([
      {
        title: "Livin' La Vida Loca",
        artist_name: 'Ricky Martin',
        genre: 'Pop',
        rating: 100
      },
      {
        title: "Bring Da Ruckus",
        artist_name: 'Wu-Tang Clan',
        genre: 'Hip Hop/Rap',
        rating: 80
      },
      {
        title: "Stairway To Heaven",
        artist_name: 'Led Zeppelin',
        genre: 'Rock',
        rating: 62
      }
    ])
    .then(() => console.log('Favorites seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
