const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add crypto polyfill
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'react-native-crypto',
};

module.exports = config;