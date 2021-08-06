import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const PaymentItem = (item, navigation) => {
  return (
    <View style={styles.recordItemCard}>
      <View>
        <Text style={styles.amountText}>{item.amount}</Text>
        <Text style={{color: colors.BLUE_LIGHT}}>
          {item.formatted_record_date}
        </Text>
      </View>
      <View>
        <TouchableOpacity style={{padding: 8}}>
          <Icon name="trash-o" size={20} color="#ff7675" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: colors.BACKGROUND,
  },
  recordItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#dfe6e9',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  amountText: {
    fontWeight: '700',
    color: colors.BLUE_DARK,
    fontSize: 17,
  },
});

export default PaymentItem;
