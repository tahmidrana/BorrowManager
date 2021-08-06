import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ProfileSettings = () => {
  return (
    <View style={styles.container}>
      <Text>Profile Settings Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
  },
});

export default ProfileSettings;
