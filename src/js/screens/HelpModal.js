import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import auth from '@react-native-firebase/auth';

import Toolbar from '../components/Toolbar';
import Button from '../components/Button';
import ProfileForm from '../components/ProfileForm';

import { generalStyle } from '../utils/Theme';

import { UserContext } from '../context/UserContext';

export default function HelpModal({ navigation }) {

  const setUser = useContext(UserContext)[1];

  function signOut() {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
        navigation.navigate("Main");
      })
      .catch((error) => {

      });
  }

  function openPrivacy() {
    navigation.navigate("PrivacyModal");
  }

  return (
    <View style={styles.helpPage}>

      <Toolbar closeButton title="Help" />

      <View style={styles.container}>

        <ProfileForm />

        <View style={styles.signOutView}>
          <Button text="Sign Out" 
            buttonStyle={[generalStyle.primaryButton]}
            textStyle={generalStyle.primaryButtonText}
            onPress={signOut} />

          <Button text="Privacy Policy" size={12} buttonStyle={styles.privacy} 
            onPress={openPrivacy}/>

          <Text style={styles.attribution}>App icon made by Freepik from www.flaticon.com</Text>
        </View>
        
      
      </View>

    </View>
  )

}

const styles = StyleSheet.create({
  helpPage: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    height: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    paddingTop: 15,
  },
  button: {
    width: 150,
  },
  privacy: {
    marginTop: 10,
  },
  signOutView: {
    marginTop: 100,
    alignItems: 'center'
  },
  attribution: {
    fontSize: 10,
    marginTop: 50,
  }
})