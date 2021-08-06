import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../styles/colors';

const ContactItem = item => {
  return (
    <TouchableOpacity style={styles.flatListItemWrapper}>
      <View>
        <Avatar.Text label={item.name[0].toUpperCase()} size={40} />
      </View>
      <View style={styles.itemDetailWrapper}>
        <View>
          <Text
            style={{fontSize: 18, color: colors.BLUE_DARK, fontWeight: '700'}}>
            {item.name}
          </Text>
          <Text style={{fontSize: 13, color: colors.BLUE_LIGHT}}>
            {item.phone}
          </Text>
        </View>
        <View>
          <TouchableOpacity style={{padding: 8, paddingRight: 0}}>
            <Icon name="trash-o" size={20} color="#ff7675" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flatListItemWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    elevation: 1,
  },
  itemDetailWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default ContactItem;
