import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  LoginPage,
  RolePage,

  MakerPage,
  CourierPage,
  CoordinatorPage
} from './src/js/screens';

import { GetRole, SetUser } from './src/js/utils/DatabaseUtils';

import { UserContext } from './src/js/context/UserContext';

const MainTab = createBottomTabNavigator();

export default function MainStackScreen({ navigation }) {
  const [role, setRole] = useState(null);
  const user = useContext(UserContext)[0];

  useEffect(() => {
    SetUser(user);

    if (!user && role != null) {
      setRole(null);
    }
    
    if (!user) return;
    if (role != null) return;

    GetRole((role) => {
      setRole(role);
    })
  }, [user]);

  if (!user) return <LoginPage navigation={navigation} />
  if (role == null) return (
        <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
          <Text style={{fontSize: 18, textAlign: 'center'}}>Loading Profile...</Text>
        </View>
      )
  
  if (role.length === 0) {
    return <RolePage setRole={setRole} />
  }

  const roles = role.split(',')
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

      {roles.includes("maker") && <MainTab.Screen name="Maker" component={MakerPage} /> }
      {role.includes("courier") && <MainTab.Screen name="Courier">
          {props => <CourierPage {...props} extraData={{role: role}} />}
        </MainTab.Screen>}
      {roles.includes("coordinator") && <MainTab.Screen name="Coordinator" component={CoordinatorPage} /> }
    </MainTab.Navigator>
  );
  
}
