import React from 'react';
import colors from '../../styles/colors';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

// import {useNavigation} from '@react-navigation/native';

const HomeItem = (item, navigation) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ViewRecord', {id: item.id})}
      // onPress={() => console.log(props)}
      style={styles.flatListItemWrapper}>
      <View>
        {item.record_type === 1 ? (
          <Icon
            name="arrow-up"
            size={16}
            color={colors.BLUE_DARK}
            style={[styles.flatListItemIcon, {backgroundColor: colors.SUCCESS}]}
          />
        ) : (
          <Icon
            name="arrow-down"
            size={16}
            color={colors.BLUE_DARK}
            style={[styles.flatListItemIcon, {backgroundColor: colors.WARNING}]}
          />
        )}
      </View>
      <View style={styles.itemDetailWrapper}>
        <View>
          {/* <Text style={{fontStyle: 'italic', color: colors.BLUE_LIGHT, fontSize: 12}}>29 Jul, 2021</Text> */}
          <Text
            style={{fontSize: 20, fontWeight: '700', color: colors.BLUE_DARK}}>
            {item.amount}
          </Text>
          <Text style={{fontSize: 14, color: colors.BLUE_LIGHT}}>
            {item.record_type === 1 ? 'Given to' : 'Taken from'} {item.contact}
          </Text>
        </View>
        <View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <Text
              style={{
                fontStyle: 'italic',
                color: colors.BLUE_LIGHT,
                fontSize: 12,
              }}>
              {item.formatted_created_at}
            </Text>
            <TouchableOpacity style={{padding: 8, paddingRight: 0}}>
              <Icon name="trash-o" size={20} color="#ff7675" />
            </TouchableOpacity>
            {/* <Text style={{ color: '#333' }}>{item.is_closed === 1 ? 'Closed' : ''}</Text> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flatListItemWrapper: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: '#dfe6e9',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    elevation: 1,
  },
  flatListItemIcon: {
    padding: 16,
    borderRadius: 50,
  },
  itemDetailWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

export default HomeItem;
