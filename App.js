import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StyleSheet, StatusBar, Alert, BackHandler} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Routes from './src/Routes';
import colors from './src/styles/colors';

const App = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.BLUE_DARK} />
      <Routes />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BACKGROUND,
  },
});

export default App;
