exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists',
      onDelete: 'cascade',
      referencesConstraintName: 'fk_playlist_song_activities.playlist_id_playlists.id',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'songs',
      onDelete: 'cascade',
      referencesConstraintName: 'fk_playlist_song_activities.song_id_songs.id',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
      referencesConstraintName: 'fk_playlist_song_activities.user_id_users.id',
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
