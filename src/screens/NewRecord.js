import React, {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {TextInput, Button, Snackbar, RadioButton} from 'react-native-paper';
import colors from '../styles/colors';
import {formStyles} from '../styles/styles';

import {
  getDBConnection,
  createTables,
  getContacts,
  createNewRecord,
} from '../db-service';

const NewRecord = ({navigation}) => {
  const [contacts, setContacts] = useState([]);

  const [amount, setAmount] = useState('');
  const [record_type, setRecordType] = useState(1);
  const [due_date, setDueDate] = useState('');
  const [short_note, setShortNote] = useState('');

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState();

  const [snackVisible, setSnackVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || '';

    setDatePickerVisible(false);
    if (currentDate) {
      const dt = currentDate.toDateString();
      setDueDate(dt);
    }
  };

  const onToggleSnackBar = () => setSnackVisible(!snackVisible);

  const handleSubmit = async () => {
    if (!amount || !record_type || !selectedContact) {
      setMessage('Record Type, Amount & Contact field is required');
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
      record_type,
      contact_id: selectedContact,
      due_date,
      short_note,
    };

    try {
      const db = await getDBConnection();
      await createTables(db);
      await createNewRecord(db, data);
      navigation.goBack();
    } catch (error) {
      setMessage('Record Create Failed');
      setSnackVisible(true);
    }
  };

  const getContactList = async () => {
    try {
      const db = await getDBConnection();
      await createTables(db);

      const contactsData = await getContacts(db);
      setContacts(contactsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getContactList();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Snackbar
        visible={snackVisible}
        onDismiss={onToggleSnackBar}
        duration={2000}>
        {message}
      </Snackbar>

      <ScrollView>
        <View style={{flexDirection: 'row', marginVertical: 6}}>
          <TouchableOpacity
            onPress={() => setRecordType(1)}
            style={[formStyles.radioBtn, {marginRight: 6}]}>
            <RadioButton
              value="1"
              status={record_type === 1 ? 'checked' : 'unchecked'}
              onPress={() => setRecordType(1)}
            />
            <Text>Given</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRecordType(2)}
            style={formStyles.radioBtn}>
            <RadioButton
              value="2"
              status={record_type === 2 ? 'checked' : 'unchecked'}
              onPress={() => setRecordType(2)}
            />
            <Text>Taken</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          value={amount}
          onChangeText={text => setAmount(text)}
          style={formStyles.textInp}
          label="Amount"
          mode="outlined"
          outlineColor={colors.WHITE}
        />

        <View style={formStyles.picker}>
          <Picker
            selectedValue={selectedContact}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedContact(itemValue)
            }>
            <Picker.Item label="Select Contact" value="" />
            {contacts.map(item => (
              <Picker.Item label={item.name} value={item.id} key={item.id} />
            ))}
          </Picker>
        </View>

        <TextInput
          value={due_date}
          onChangeText={text => setDueDate(text)}
          style={formStyles.textInp}
          label="Due Date"
          mode="outlined"
          editable={false}
          outlineColor={colors.WHITE}
          right={
            <TextInput.Icon
              name="calendar"
              onPress={() => setDatePickerVisible(!datePickerVisible)}
            />
          }
        />

        {datePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
            style={formStyles.textInp}
          />
        )}

        <TextInput
          value={short_note}
          onChangeText={text => setShortNote(text)}
          style={formStyles.textInp}
          label="Short Note"
          mode="outlined"
          multiline={true}
          numberOfLines={3}
          outlineColor={colors.WHITE}
        />

        <Button
          onPress={handleSubmit}
          mode="contained"
          style={styles.submitBtn}
          icon="check">
          Save
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
  },
  submitBtn: {
    marginTop: 6,
    padding: 5,
  },
});

export default NewRecord;
