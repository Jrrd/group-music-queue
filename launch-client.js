
var logger = require('./lib/shared/logging/Logger').Client

logger.info('');
logger.info('Welcome to the Music Queue client.');
logger.info('In the future we will offer you some info here on how to add music to the shared queue.');
logger.info('');


// kick off client app
require('./lib/client/ClientApp');
