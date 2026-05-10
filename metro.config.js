const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude .local directory from watching to prevent ENOENT errors
config.watchFolders = [__dirname];
config.resolver.blockList = [
  /\.local\/.*/,
  /\.agents\/.*/,
  /\.cache\/.*/,
];

module.exports = config;
