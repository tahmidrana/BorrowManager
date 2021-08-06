import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import MenuIcon from './components/MenuIcon';
import MenuContent from './components/MenuContent';

import Home from './screens/Home';
import ViewRecord from './screens/ViewRecord';
import NewRecord from './screens/NewRecord';

import About from './screens/About';
import Contacts from './screens/Contacts';
import ProfileSettings from './screens/ProfileSettings';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const headerBackgroundColor = '#34495e';
const headerTintColor = '#fff';

const screenOptions = {
  // headerLeft: () => <MenuIcon />,
  headerStyle: {
    backgroundColor: headerBackgroundColor, //Set Header color
  },
  headerTintColor: headerTintColor, //Set Header text color
  headerTitleStyle: {
    fontWeight: 'bold', //Set Header text style
  },
  headerTitleAlign: 'center',
};

function homeScreenStack({navigation}) {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerLeft: () => <MenuIcon />, title: 'Home'}}
      />
      <Stack.Screen
        name="ViewRecord"
        component={ViewRecord}
        options={{
          title: 'View Detail', //Set Header Title
        }}
      />
      <Stack.Screen
        name="NewRecord"
        component={NewRecord}
        options={{
          title: 'New Record', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
}

function contactsScreenStack({navigation}) {
  return (
    <Stack.Navigator initialRouteName="Contacts" screenOptions={screenOptions}>
      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={{headerLeft: () => <MenuIcon />}}
      />
    </Stack.Navigator>
  );
}

function profileScreenStack({navigation}) {
  return (
    <Stack.Navigator
      initialRouteName="ProfileSettings"
      screenOptions={screenOptions}>
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{
          headerLeft: () => <MenuIcon />,
          title: 'Profile Settings', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
}

const Routes = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        // screenOptions={screenOptions}
        drawerContent={props => <MenuContent {...props} />}
        drawerContentOptions={{
          activeTintColor: '#e91e63',
          itemStyle: {marginVertical: 5},
        }}>
        <Drawer.Screen
          name="homeScreenStack"
          options={{drawerLabel: 'Home', headerTitle: 'Home'}}
          component={homeScreenStack}
        />

        <Drawer.Screen
          name="contactsScreenStack"
          options={{drawerLabel: 'Contacts'}}
          component={contactsScreenStack}
        />

        <Drawer.Screen
          name="profileScreenStack"
          options={{drawerLabel: 'Profile Settings'}}
          component={profileScreenStack}
        />

        <Drawer.Screen
          name="About"
          options={{
            ...screenOptions,
            drawerLabel: 'About',
            headerShown: true,
          }}
          component={About}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
