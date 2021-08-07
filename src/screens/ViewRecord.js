import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  FAB,
  Colors,
  Menu,
  Divider,
  Portal,
  TextInput,
  Modal,
  Button,
  Snackbar,
} from 'react-native-paper';
import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

import PaymentItem from '../components/records/PaymentItem';

import {
  getDBConnection,
  getRecordById,
  createNewPayment,
  getPaymentsByRecordId,
  recordClose,
} from '../db-service';

const HeaderRight = ({onCloseRecord}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const closeRecord = () => {
    closeMenu();
    onCloseRecord();
  };

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
      <Menu.Item onPress={closeRecord} title="Close" />
    </Menu>
  );
};

const StatusArea = ({subTotal}) => {
  let status = subTotal === 0 ? 'Paid' : (subTotal < 0 ? 'Over Paid' : '');
  let bg_color = subTotal === 0 ? colors.SUCCESS : (subTotal < 0 ? colors.WARNING : colors.BLUE_DARK);

  return (
    <View
      style={{
        padding: 12,
        backgroundColor: bg_color,
        borderRadius: 8,
        marginTop: 10,
      }}>
      <Text style={{ fontWeight: '700' }}>
        {status} {subTotal < 0 ? (subTotal * -1) : ''}
      </Text>
    </View>
  );
};

const ViewRecord = ({route, navigation}) => {
  const {id} = route.params;

  const [subTotal, setSubTotal] = useState(0);
  const [record, setRecord] = useState({});
  const [payments, setPayments] = useState([]);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [amount, setAmount] = React.useState('');

  const [snackVisible, setSnackVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const onToggleSnackBar = () => setSnackVisible(!snackVisible);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const closeRecordAction = async () => {
    try {
      const db = await getDBConnection();
      await recordClose(db, id);
      loadDataCallback();
    } catch (e) {
      //
    }
  };

  const closeRecord = () => {
    Alert.alert('Hold on!', 'Are you sure you want to close this record?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => closeRecordAction()},
    ]);
  };

  const addNewPayment = async () => {
    if (!amount) {
      setMessage('Amount field is required');
      setSnackVisible(true);
      return;
    }

    if (isNaN(amount) === true) {
      setMessage('Invalid Amount');
      setSnackVisible(true);
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

      loadDataCallback();
      hideModal();

      setMessage('New payment added');
      setSnackVisible(true);

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
      paymentsData.forEach(item => {
        records_total += item.amount;
      });

      let sub_total = recordData.amount - records_total;
      setSubTotal(sub_total);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight onCloseRecord={closeRecord} />,
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
      {record.is_closed === 0 && (
        <FAB style={styles.fab} medium icon="plus" onPress={showModal} />
      )}

      <Snackbar
        visible={snackVisible}
        onDismiss={onToggleSnackBar}
        duration={2000}>
        {message}
      </Snackbar>

      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.subTotalText}>Sub Total:</Text>
        <Text style={styles.subTotalText}>
          {subTotal}{' '}
          {subTotal <= 0 && (
            <Icon name="check-circle" size={18} color={colors.SUCCESS} />
          )}
        </Text>
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
          {record.is_closed 
            ? <Text style={{color: colors.DANGER}}>Closed</Text>
            : (<Text style={{color: colors.GRAY_LIGHT}}>
              Due Date:{' '}
              {record.formatted_due_date ? record.formatted_due_date : '-'}
            </Text>)
          }
        </View>
      </View>

      {subTotal <= 0 && <StatusArea subTotal={subTotal} />}

      <View style={{marginTop: 10}}>
        <Text style={{fontSize: 14, marginBottom: 8}}>Payments</Text>

        <FlatList
          data={payments}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <PaymentItem item={item} onItemDelete={loadDataCallback} />
          )}
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
