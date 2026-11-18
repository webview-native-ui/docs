const config = require('./docusaurus.config');
config.presets[0][1].googleTagManager = false;
config.plugins = config.plugins.filter((plugin) => typeof plugin !== 'function');
module.exports = config;
