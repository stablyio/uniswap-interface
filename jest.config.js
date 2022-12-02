module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest-setup.js', './node_modules/react-native-gesture-handler/jestSetup.js'],
  // https://github.com/facebook/jest/issues/2663#issuecomment-341384494
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transform: {
    '\\.svg$': 'jest-svg-transformer',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-reanimated|@react-native|@react-native-firebase|react-native-redash|react-native-webview|@gorhom|expo.*|react-native-flipper|d3-(array|color|format|interpolate|path|scale|shape|time-format|time)|internmap|react-native-qrcode-svg|react-native-modal|react-native-animatable)|react-native-masked-view|expo-linear-gradient|expo-blur|redux-persist/)',
  ],
}