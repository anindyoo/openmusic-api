const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    playlistsService, collaborationsService, usersService, validator,
  }) => {
    const ps = playlistsService; const cs = collaborationsService; const
      us = usersService;
    const collaborationsHandler = new CollaborationsHandler(ps, cs, us, validator);
    server.route(routes(collaborationsHandler));
  },
};
