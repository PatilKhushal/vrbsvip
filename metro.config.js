/* const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 *
const config = mergeConfig(getDefaultConfig(__dirname), {
    /* your config *
  });

  module.exports = withNativeWind(config, { input: "./src/global.css" });
 */

  const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
  const { withNativeWind } = require("nativewind/metro");
  const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
  
  /**
   * Metro configuration
   * https://reactnative.dev/docs/metro
   *
   * @type {import('@react-native/metro-config').MetroConfig}
   */
  let config = getDefaultConfig(__dirname);
  
  // NativeWind के साथ मर्ज करें
  config = withNativeWind(config, { input: "./src/global.css" });
  
  // Reanimated के साथ मर्ज करें
  config = wrapWithReanimatedMetroConfig(config);
  
  module.exports = mergeConfig(config, {
    // अगर आपको कोई और कॉन्फ़िगरेशन जोड़ना है, तो यहाँ जोड़ें
  });