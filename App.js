import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet, StatusBar, Alert, BackHandler} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Routes from './src/Routes';
import colors from './src/styles/colors';

import Splash from './src/screens/Splash';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

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

    setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.BLUE_DARK} />
      {showSplash ? <Splash /> : <Routes />}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BACKGROUND,
  },
});

export default App;
