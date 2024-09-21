// config-overrides.js
module.exports = function override(config, env) {
    // Ignore source map warnings
    config.ignoreWarnings = [/Failed to parse source map/];
    
    return config;
  };
  