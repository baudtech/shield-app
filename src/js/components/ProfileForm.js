import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

import Geocoder from 'react-native-geocoder';

import Button from '../components/Button';
import { ProfileContext } from '../context/ProfileContext';
import { generalStyle } from '../utils/Theme';

import {
  UpdateProfile,
} from '../utils/DatabaseUtils';

const FormInput = (props) => {

  const textChanged = (text) => { props.profile[props.name] = text }

  return (
    <TextInput placeholder={props.placeholder} style={styles.textInput}
      defaultValue={props.profile[props.name]} onChangeText={textChanged} />
  );
}

export default function ProfileForm(props) {
  const [tempProfile, setTempProfile] = useState({
    name: '',
    addres: '',
    phone: ''
  });
  const [profile, setProfile] = useContext(ProfileContext);

  useEffect(() => {
    setTempProfile(profile);

    if (props.onChange) props.onChange(profile);
  }, [profile]);

  function updateInfo() {
    const updatedProfile = tempProfile;

    Geocoder.geocodeAddress(updatedProfile.address).then(res => {
      // res is an Array of geocoding object (see below)
      updatedProfile.coordinates = {
        latitude: res[0].position.lat,
        longitude: res[0].position.lng
      };
      
      UpdateProfile(updatedProfile, (success) => {
        setProfile(profile);
      });
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.container}
    >
    <View style={styles.container}>
      <Text style={styles.header}>Details</Text>

      <FormInput profile={tempProfile} name="name" placeholder="Name" />
      <FormInput profile={tempProfile} name="address" placeholder="Address" />
      <FormInput profile={tempProfile} name="phone" placeholder="Phone" />

      {!props.hideButton && 
        <Button text="Update Info"
        buttonStyle={[generalStyle.primaryButton, styles.updateButton]}
        textStyle={generalStyle.primaryButtonText}
        onPress={updateInfo} /> }
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 22,
  },
  container: {
    alignSelf: 'stretch',
  },
  textInput: {
    height: 40,
    alignSelf: 'stretch',
    marginBottom: 10,
    fontSize: 18,
    paddingLeft: 10,

    borderWidth: 1,
    borderColor: '#005290',
    borderRadius: 5,
  },
  updateButton: {
    alignSelf: 'center',
    marginTop: 20,
  }
})