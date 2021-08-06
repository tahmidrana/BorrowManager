import React from 'react';
import {View, Text} from 'react-native';

import {getDBConnection, createTables, saveNewContact} from '../db-service';

const NewContact = () => {

  const addNewContact = async () => {
    try {
      const db = await getDBConnection();
      await createTables(db);

      const data = {
        name: 'John Doe',
        phone: '01115244458',
        email: '',
        address: '',
        notes: '',
      };
      await saveNewContact(db, data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Text>Add New Contact Page</Text>
    </View>
  );
};

export default NewContact;
