import React from 'react';
import {View, Text, StatusBar} from 'react-native';

const Splash = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e90ff',
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="#1e90ff" />
      <Text style={{fontSize: 34, color: '#fff', fontWeight: '700'}}>
        Borrow Manager
      </Text>
      <Text style={{color: '#fff'}}>Easily track your lend and borrows</Text>
    </View>
  );
};

export default Splash;
