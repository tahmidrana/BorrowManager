import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import colors from '../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getDBConnection, deletePaymentById} from '../../db-service';

const PaymentItem = ({item, onItemDelete}) => {
  const deletePaymentAction = async () => {
    try {
      const db = await getDBConnection();
      await deletePaymentById(db, item.id);
      onItemDelete();
    } catch (e) {
      //
    }
  };

  const deletePayment = async () => {
    Alert.alert('Hold on!', 'Are you sure you want to delete?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => deletePaymentAction()},
    ]);
  };

  return (
    <View style={styles.recordItemCard}>
      <View>
        <Text style={styles.amountText}>{item.amount}</Text>
        <Text style={{color: colors.BLUE_LIGHT}}>
          {item.formatted_record_date}
        </Text>
      </View>
      <View>
        <TouchableOpacity style={{padding: 8}} onPress={deletePayment}>
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
