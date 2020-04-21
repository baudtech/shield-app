import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  LoginPage,
  RolePage,

  MakerPage,
  CourierPage,
  CoordinatorPage
} from './src/js/screens';

import { SetUser } from './src/js/utils/DatabaseUtils';

import { UserContext, RoleContext } from './src/js/context';

// const MainStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export default function MainStackScreen({ navigation }) {
  const [role, setRole] = useContext(RoleContext);
  const user = useContext(UserContext)[0];

  useEffect(() => {
    SetUser(user);
  }, [user]);

  if (!user) return <LoginPage navigation={navigation} />
  if (role == null) return (
    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
      <Text style={{fontSize: 18, textAlign: 'center'}}>Loading Profile...</Text>
    </View>
  )

  if (Object.keys(role).length === 0) {
    return <RolePage setRole={setRole} />
  }

  return (
    <MainTab.Navigator headerMode="none"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Maker') {
            iconName = 'md-build';
          } else if (route.name === 'Courier') {
            iconName = 'md-bicycle';
          }
          else if (route.name === 'Coordinator') {
            iconName = 'md-person';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={22} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#005290',
      }}>

      {role.maker && <MainTab.Screen name="Maker" component={MakerPage} /> }
      {(role.courier || role.courier_request) && <MainTab.Screen name="Courier">
          {props => <CourierPage {...props} extraData={{role: role}} />}
        </MainTab.Screen>}
      {role.coordinator && <MainTab.Screen name="Coordinator" component={CoordinatorPage} /> }
    </MainTab.Navigator>
  );
  
}
