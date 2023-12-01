exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users',
      onDelete: 'cascade',
      referencesConstraintName: 'fk_playlists.owner_users.id',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
