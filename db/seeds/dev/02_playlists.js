exports.seed = function(knex) {
  return knex('playlists').del()
  .then(() => {
    return knex('playlists').insert([
      { title: 'Monster Jamz' },
      { title: 'Fresh Beatz'}
    ])
    .then(() => console.log('Playlist seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
