import 'react-native-gesture-handler';

import React, { useState, useEffect, useContext } from 'react';

import { GoogleSignin } from '@react-native-community/google-signin';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import MainStackScreen from './MainStackScreen';
import { HelpModal, PrivacyModal, QRCodeModal, QRScannerModal } from './src/js/screens';

import {
  UserContextProvider,
  ProfileContextProvider,
  RoleContextProvider
} from './src/js/context';

import { GOOGLE_SIGN_IN_KEY } from './src/appData.js'

GoogleSignin.configure({
  webClientId: GOOGLE_SIGN_IN_KEY, 
  offlineAccess: false
});


const RootStack = createStackNavigator();

export default function App() {
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, paddingBottom: 0}}>

        <UserContextProvider>
          <ProfileContextProvider>
            <RoleContextProvider>

              <NavigationContainer>
                <RootStack.Navigator headerMode="none" mode="modal">

                  <RootStack.Screen name="Main" component={MainStackScreen} options={{ headerShown: false }} />
                  <RootStack.Screen name="HelpModal" component={HelpModal} />
                  <RootStack.Screen name="PrivacyModal" component={PrivacyModal} />
                  <RootStack.Screen name="QRCodeModal" component={QRCodeModal} />
                  <RootStack.Screen name="QRScannerModal" component={QRScannerModal} />
                
                </RootStack.Navigator>
              </NavigationContainer>

            </RoleContextProvider>
          </ProfileContextProvider>
        </UserContextProvider>

      </SafeAreaView>
      
    </SafeAreaProvider>
  );

}