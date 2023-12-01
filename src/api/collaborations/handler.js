const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(playlistsService, collaborationsService, usersService, validator) {
    this.playlistsService = playlistsService;
    this.collaborationsService = collaborationsService;
    this.usersService = usersService;
    this.validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this.validator.validateCollaborationPayload(request.payload);

    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this.usersService.verifyUserById(userId);
    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this.collaborationsService.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Collaboration berhsail ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);

    return response;
  }

  async deleteCollaborationHandler(request) {
    this.validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Collaboration berhasil dihapus.',
    };
  }
}

module.exports = CollaborationsHandler;
