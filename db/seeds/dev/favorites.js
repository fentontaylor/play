exports.seed = function(knex) {

  return knex('favorites').del() // delete all favorites first
    .then(() => {
      return Promise.all([
        knex('favorites').insert({
          title: "Livin' La Vida Loca", artist_name: 'Ricky Martin', genre: 'Latin Pop', rating: 100
        }, "id")
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
