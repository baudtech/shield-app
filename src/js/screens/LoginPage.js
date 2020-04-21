import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';

import auth from '@react-native-firebase/auth';
 
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';

import { SetUser, CreateUser } from '../utils/DatabaseUtils';

import Button from '../components/Button';
import { UserContext } from '../context';

export default function LoginPage({ navigation }) {
  const [user, setUser] = useContext(UserContext);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // return is used as componentWillUnmount
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle user state changes
  function onAuthStateChanged(newUser) {
    if (initializing) setInitializing(false);

    if (newUser === auth().currentUser && user === newUser) return;

    SetUser(newUser);

    // set user after first creating him in the database
    // so we can retrieve the role
    if (newUser) {
      CreateUser(() => {
        setUser(newUser);
      });
    }
    else {
      setUser(newUser);
    }
  }

  async function onGoogleButtonPress() {
    try {
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      auth()
        .signInWithCredential(googleCredential)
        .catch(catchGoogleError)
    } catch(error) {
      // console.log("[Login] Sign-in was cancelled");
    }
  }

  const catchGoogleError = error => {
    if (!error || !error.code) return;

    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        // sign in was cancelled
        Alert.alert('cancelled');
        break;
      case statusCodes.IN_PROGRESS:
        // operation (eg. sign in) already in progress
        Alert.alert('in progress');
        break;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        // android only
        Alert.alert('play services not available or outdated');
        break;
      default:
        Alert.alert('Something went wrong', error.toString());
      }
  }

  function openPrivacy() {
    navigation.navigate("PrivacyModal");
  }

  if (initializing) return <Text>Loading</Text>;

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>

        <View>
          <Button text="Sign in with Google" 
            buttonStyle={styles.button} textStyle={styles.buttonText}
            onPress={onGoogleButtonPress}
          />
          
          <Button text="By signing you agree to the Terms and Conditions." size={12} buttonStyle={styles.privacy} 
            onPress={openPrivacy}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    height: '80%',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 100,
  },
  button: {
    width: 200,
    backgroundColor: '#005290',
  },
  buttonText: {
    color: 'white'
  },
  privacy: {
    alignSelf: 'center',
    width: 180,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
});

