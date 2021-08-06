import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import {
  FAB,
  Colors,
  Menu,
  Divider,
  Portal,
  TextInput,
  Modal,
  Button,
} from 'react-native-paper';
import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

import PaymentItem from '../components/records/PaymentItem';

import {
  getDBConnection,
  getRecordById,
  createNewPayment,
  getPaymentsByRecordId,
} from '../db-service';

const HeaderRight = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  return (
    <Menu
      visible={menuVisible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu} style={{padding: 18}}>
          <Icon name="align-center" size={20} color="#fff" />
        </TouchableOpacity>
      }>
      <Menu.Item onPress={() => {}} title="Edit" />
      <Menu.Item onPress={() => {}} title="Paid & Close" />
      <Divider />
      <Menu.Item onPress={() => {}} title="Close" />
    </Menu>
  );
};

const ViewRecord = ({route, navigation}) => {
  const {id} = route.params;

  const [subTotal, setSubTotal] = useState(0);
  const [record, setRecord] = useState({});
  const [payments, setPayments] = useState([]);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [amount, setAmount] = React.useState('');

  /* const [snackVisible, setSnackVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const onToggleSnackBar = () => setSnackVisible(!snackVisible); */

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const addNewPayment = async () => {
    if (!amount) {
      /* setMessage('Record Type, Amount & Contact field is required');
      setSnackVisible(true); */
      return;
    }

    if (isNaN(amount) === true) {
      /* setMessage('Invalid Amount');
      setSnackVisible(true); */
      return;
    }

    const data = {
      amount,
      record_id: id,
      record_date: new Date(),
    };

    try {
      const db = await getDBConnection();
      await createNewPayment(db, data);

      hideModal();

      /* setMessage('Contact Created Successfully');
      setSnackVisible(true); */

      setAmount('');
    } catch (error) {
      console.log(error);
    }
  };

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();

      const recordData = await getRecordById(db, id);
      setRecord(recordData);

      const paymentsData = await getPaymentsByRecordId(db, id);

      setPayments(paymentsData);

      let records_total = 0;
      let sub_total = recordData.amount - records_total;
      setSubTotal(sub_total);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight />,
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDataCallback();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FAB style={styles.fab} medium icon="plus" onPress={showModal} />

      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.subTotalText}>Sub Total:</Text>
        <Text style={styles.subTotalText}>{subTotal}</Text>
      </View>
      <View style={styles.detailCard}>
        <View>
          <Text style={{fontWeight: '700', fontSize: 18, color: colors.WHITE}}>
            {record.record_type == 1 ? (
              <Icon name="arrow-up" color={colors.SUCCESS} />
            ) : (
              <Icon name="arrow-down" color={colors.WARNING} />
            )}
            {record.record_type == 1 ? ' Given to' : ' Taken from'}{' '}
            {record.contact}
          </Text>
          <Text style={{color: colors.GRAY_LIGHT}}>
            {record.formatted_created_at}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text
            style={{fontWeight: '700', color: colors.WARNING, fontSize: 18}}>
            {record.amount}
          </Text>
          <Text style={{color: colors.GRAY_LIGHT}}>
            Due Date:{' '}
            {record.formatted_due_date ? record.formatted_due_date : '-'}
          </Text>
        </View>
      </View>

      <View style={{marginTop: 10}}>
        <Text style={{fontSize: 14, marginBottom: 8}}>Payments</Text>

        <FlatList
          data={payments}
          keyExtractor={item => item.id}
          renderItem={({item}) => PaymentItem(item, navigation)}
          nestedScrollEnabled={true}
        />
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 15,
              textAlign: 'center',
            }}>
            New Payment
          </Text>

          <TextInput
            value={amount}
            onChangeText={text => setAmount(text)}
            style={styles.textInp}
            label="Amount"
            mode="outlined"
            outlineColor={colors.WHITE}
          />
          <Button
            icon="check"
            mode="contained"
            style={styles.modalBtn}
            onPress={addNewPayment}>
            Save
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: colors.BACKGROUND,
  },
  subTotalText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.BLUE_DARK,
  },
  detailCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    // backgroundColor: '#dfe6e9',
    backgroundColor: '#6c5ce7',
  },
  fab: {
    position: 'absolute',
    margin: 18,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.blue500,
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 4,
  },
  modalBtn: {
    marginVertical: 12,
    paddingVertical: 5,
    color: '#fff',
  },
  textInp: {
    marginBottom: 6,
    borderRadius: 10,
  },
});

export default ViewRecord;
