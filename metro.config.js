const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  // Prioritize CommonJS modules over ESM, bypassing `import.meta` checks
  unstable_conditionNames: ['browser', 'require', 'react-native'],
};

module.exports = withNativeWind(config, { input: './global.css' });
