/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      unique: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists',
      onDelete: 'cascade',
      referencesConstraintName: 'fk_playlist_songs.playlist_id_playlists.id',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'songs',
      onDelete: 'cascade',
      referencesConstraintName: 'fk_playlist_songs.song_id_songs.id',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
