module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      // Enables modern JS features like optional chaining, nullish coalescing, etc.
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@api': './src/api',
            '@utils': './src/utils',
            '@types': './src/types',
          },
        },
      ],
      // Optional: reanimated plugin if you use animations
      'react-native-reanimated/plugin',
    ],
  };
};
