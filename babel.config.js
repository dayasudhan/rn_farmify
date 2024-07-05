module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@components': './src/components',
        '@assets': './src/assets',
        '@screens': './src/screens',
        // Add other aliases as needed
      },
    }],
  ],
};
