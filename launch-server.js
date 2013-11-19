var logger = require('./lib/shared/logging/Logger').Server;

logger.info('');
logger.info('Welcome to the Music Queue Server.');
logger.info('');


// kick off client app
require('./lib/server/ServerApp');
