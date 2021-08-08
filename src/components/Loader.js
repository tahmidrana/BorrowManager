import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Colors} from 'react-native-paper';

const Loader = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator animating={true} color={Colors.red800} size="large" />
    </View>
  );
};

export default Loader;
