const FontminPlugin = require('fontmin-webpack')

module.exports = function override(config, env) {
  config.plugins.push(
    new FontminPlugin({
      autodetect: true, // automatically pull unicode characters from CSS
      // glyphs: ['\uf0c8' /* extra glyphs to include */],
    }),
  );
  return config;
}
