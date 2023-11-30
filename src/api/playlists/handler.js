const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan.',
      data: {
        playlistId,
      },
    });
    response.code(201);

    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus.',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    await this._songsService.verifySongExistence(songId);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistActivityId = await this._playlistsService.addPlaylistActivity({
      playlistId, songId, userId: credentialId, action: 'add',
    });

    const playlistSongId = await this._playlistsService.addPlaylistSong({
      playlistId, songId,
    });

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke Playlist.',
      data: {
        playlistSongId,
      },
    });
    response.code(201);

    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistSongs = await this._playlistsService.getPlaylistSongs(playlistId);

    return {
      status: 'success',
      data: {
        playlist: playlistSongs,
      },
    };
  }

  async deletePlaylistSongByIdHandler(request) {
    this._validator.validatePostPlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    await this._songsService.verifySongExistence(songId);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.deletePlaylistSongById(songId);

    const playlistActivityId = await this._playlistsService.addPlaylistActivity({
      playlistId, songId, userId: credentialId, action: 'delete',
    });

    return {
      status: 'success',
      message: 'Song berhasil dihapus dari Playlist.',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlistActivities = await this._playlistsService.getPlaylistActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities: playlistActivities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
