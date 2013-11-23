// var logger = require('./lib/shared/logging/Logger').Server;
var Logger = require('./lib/shared/logging/Logger'),
    logger = Logger.getLogger();

logger.info('');
logger.info('Welcome to the Music Queue Server.');
logger.info('');


// kick off client app
require('./lib/server/ServerApp');
