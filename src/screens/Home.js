import React, {useState, useCallback, useEffect} from 'react';
import colors from '../styles/colors';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {FAB, Colors} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';

import HomeItem from '../components/home/HomeItem';

import {getDBConnection, createTables, getAllRecords} from '../db-service';

const Home = ({navigation}) => {
  const [records, setRecords] = useState([]);
  const [givenVal, setGivenVal] = useState(0);
  const [takenVal, setTakenVal] = useState(0);

  const [loading, setLoading] = useState(true);

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTables(db);

      const recordsData = await getAllRecords(db);
      if (recordsData.length) {
        setRecords(recordsData);

        let given = 0;
        let taken = 0;
        recordsData.forEach(item => {
          given += item.record_type === 1 ? item.amount : 0;
          taken += item.record_type === 2 ? item.amount : 0;
        });

        setGivenVal(given);
        setTakenVal(taken);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      loadDataCallback();
      /* setTimeout(() => {
        setLoading(false);
      }, 1000); */
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
        onPress={() => navigation.navigate('NewRecord')}
      />

      { loading ? <Loader /> : <>

      <View style={styles.countingsWrapper}>
        <View style={styles.givenWrapper}>
          <Text style={[styles.givenTitle, {color: colors.SUCCESS}]}>
            <Icon name="arrow-up" color={colors.SUCCESS} /> Given
          </Text>
          <Text style={styles.givenValue}>{givenVal}</Text>
        </View>
        <View
          style={[
            styles.givenWrapper,
            {borderLeftWidth: 0.8, borderLeftColor: '#a29bfe'},
          ]}>
          <Text style={[styles.givenTitle, {color: colors.WARNING}]}>
            <Icon name="arrow-down" color={colors.WARNING} /> Taken
          </Text>
          <Text style={styles.givenValue}>{takenVal}</Text>
        </View>
      </View>

      <View style={{ marginVertical: 6 }}>
        <FlatList
          data={records}
          keyExtractor={item => item.id}
          renderItem={({item}) => HomeItem(item, navigation)}
          nestedScrollEnabled={true}
          navigation={navigation}
        />
      </View>
      </>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    // backgroundColor: '#f1f2f6',
    backgroundColor: '#f2f4f8',
  },
  countingsWrapper: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 100,
    // height: 100,
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 18,
  },
  givenWrapper: {
    flex: 1,
    paddingLeft: 18,
  },
  givenTitle: {
    fontSize: 16,
    color: '#fff',
  },
  givenValue: {
    fontSize: 24,
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 18,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.blue500,
  },
});

export default Home;
