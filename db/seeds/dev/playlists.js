exports.seed = function(knex) {

  return knex('playlists').del()
    .then(() => {
      return Promise.all([
        knex('playlists').insert({
          title: "Kids These Days"
        }, "id")
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
