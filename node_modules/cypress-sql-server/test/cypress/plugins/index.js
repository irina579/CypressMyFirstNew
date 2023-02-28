const mis = require('../../../index.js');

/**
 * Fetch the appropriate .json file based on the CYPRESS_ENVIRONMENT ENV variable
 */
module.exports = (on, config) => {
  tasks = mis.loadDBPlugin(config.db);
  on('task', tasks);
}