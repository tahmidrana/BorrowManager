/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import App from './App';
import {name as appName} from './app.json';
import colors from './src/styles/colors';

const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.PRIMARY,
    accent: colors.ACCENT,
    background: colors.BACKGROUND,
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
