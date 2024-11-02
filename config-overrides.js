// config-overrides.js
module.exports = function override(config) {
  config.module.rules.push({
    test: /\.mjs$/,
    enforce: "pre",
    use: ["source-map-loader"],
    exclude: /node_modules/, // Ignorer node_modules
  });

  // Ajouter une option pour ignorer les avertissements spécifiques
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
