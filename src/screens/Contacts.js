import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Loader from '../components/Loader';
import {
  FAB,
  Colors,
  Portal,
  Modal,
  TextInput,
  Button,
  Snackbar,
} from 'react-native-paper';

import {
  getDBConnection,
  createTables,
  getContacts,
  saveNewContact,
} from '../db-service';
import colors from '../styles/colors';

import ContactItem from '../components/contacts/ContactItem';

const Contacts = ({navigation}) => {
  const [loading, setLoading] = useState(true);

  const [contacts, setContacts] = useState([]);

  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const [snackVisible, setSnackVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const onToggleSnackBar = () => setSnackVisible(!snackVisible);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const addNewContact = async () => {
    if (name.length < 2) {
      setMessage('Name must be minimum 2 character');
      setSnackVisible(true);
      return;
    }
    const data = {
      name,
      phone,
      notes,
    };

    try {
      const db = await getDBConnection();
      await createTables(db);
      await saveNewContact(db, data);

      hideModal();

      setMessage('Contact Created Successfully');
      setSnackVisible(true);

      setName('');
      setPhone('');
      setNotes('');

      loadDataCallback();
    } catch (error) {
      console.log(error);
    }
  };

  const loadDataCallback = async () => {
    try {
      const db = await getDBConnection();
      await createTables(db);

      const contactsData = await getContacts(db);
      setContacts(contactsData);
      // setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      loadDataCallback();
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FAB
        style={styles.fab}
        medium
        icon="plus"
        // onPress={() => navigation.navigate('NewContact')}
        onPress={showModal}
      />

      <Snackbar
        visible={snackVisible}
        onDismiss={onToggleSnackBar}
        duration={2000}>
        {message}
      </Snackbar>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 15,
              textAlign: 'center',
            }}>
            Add New Contact
          </Text>

          <TextInput
            value={name}
            onChangeText={text => setName(text)}
            style={styles.textInp}
            label="Name"
            mode="outlined"
            outlineColor={colors.WHITE}
          />

          <TextInput
            value={phone}
            onChangeText={text => setPhone(text)}
            style={styles.textInp}
            label="Phone"
            mode="outlined"
            outlineColor={colors.WHITE}
          />

          <TextInput
            value={notes}
            onChangeText={text => setNotes(text)}
            style={styles.textInp}
            label="Short Note"
            mode="outlined"
            outlineColor={colors.WHITE}
          />

          <Button
            icon="check"
            mode="contained"
            style={styles.modalBtn}
            onPress={addNewContact}>
            Save
          </Button>
        </Modal>
      </Portal>

      {loading ? (
        <Loader />
      ) : (
        <>
          <View>
            <FlatList
              data={contacts}
              keyExtractor={item => item.id}
              renderItem={({item}) => ContactItem(item)}
              nestedScrollEnabled={true}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.BACKGROUND,
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
  textInp: {
    marginBottom: 6,
    borderRadius: 10,
  },
  modalBtn: {
    marginVertical: 12,
    paddingVertical: 5,
    color: '#fff',
  },
});

export default Contacts;
