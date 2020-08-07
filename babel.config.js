module.exports = function(api) {
  api.cache(true);

  const plugins = [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '@rainbow-me/config': './src/config',
          '@rainbow-me/helpers': './src/helpers',
          '@rainbow-me/hooks': './src/hooks',
          '@rainbow-me/navigation': './src/navigation',
          '@rainbow-me/routes': './src/navigation/routesNames',
          '@rainbow-me/styles': './src/styles',
          '@rainbow-me/utils': './src/utils',
          'logger': './src/utils/logger',
          'react-native-animated-charts': './src/react-native-animated-charts',
          'react-native-cool-modals': './src/react-native-cool-modals',
          'react-native-reanimated': 'react-native-reanimated/src/Animated',
        },
        root: ['./src'],
      },
    ],
    'babel-plugin-styled-components',
    'date-fns',
    'graphql-tag',
    ['lodash', { id: ['lodash', 'recompact'] }],
    'react-native-reanimated/plugin',
  ];

  const presets = [
    'module:metro-react-native-babel-preset',
    'module:react-native-dotenv',
  ];

  return {
    env: {
      development: {
        plugins: [
          ...plugins,
          [
            'transform-remove-console',
            { exclude: ['disableYellowBox', 'error', 'info', 'log'] },
          ],
        ],
        presets: presets,
      },
      production: {
        plugins: [
          ...plugins,
          '@babel/plugin-transform-runtime',
          '@babel/plugin-transform-react-inline-elements',
          ['transform-remove-console', { exclude: ['error'] }],
        ],
        presets: presets,
      },
    },
    plugins,
    presets,
  };
};
