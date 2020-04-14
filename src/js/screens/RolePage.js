import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

import Geocoder from 'react-native-geocoder';

import BasePage from './BasePage';
import Button from '../components/Button';
import ProfileForm from '../components/ProfileForm';
import CheckboxRow from '../components/CheckboxRow';

import { generalStyle } from '../utils/Theme';

import { UpdateRole, UpdateProfile } from '../utils/DatabaseUtils';
import { ProfileContext } from '../context/ProfileContext';

export default function RolePage(props) {
  let userProfile;

  const [maker, setMaker] = useState(false);
  const [courier, setCourier] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useContext(ProfileContext);

  makerChanged = () => { setMaker(!maker); }
  courierChanged = () => { setCourier(!courier); }

  useEffect(() => {
    userProfile = profile;
  }, [profile])

  const continueClicked = () => {
    if (!profile || !profile.name || !profile.address || !profile.phone) {
      setError("Please fill out your details.");
      return;
    }
    setError("");

    updateInfo();
    
    var roles = "";
    if (maker && courier) {
      roles = "maker,courier_request"
    }
    else {
      roles = maker ? "maker" : "courier_request"
    }

    UpdateRole(roles, (success) => {
      if (success) props.setRole(roles);
    });
  }

  const profileChanged = (profile) => {
    this.tempProfile = profile;
  }

  const updateInfo = () => {
    const updatedProfile = this.tempProfile;

    Geocoder.geocodeAddress(updatedProfile.address).then(res => {
      // res is an Array of geocoding object (see below)
      // console.log(res);
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
    <BasePage title="Choose your Role" pageStyle={{padding: 30, paddingTop: 15}}>
      <View style={styles.container}>

        <ProfileForm hideButton onChange={profileChanged}/>
        <Text style={{color: 'red'}}>{error}</Text>

        <View style={{width: '100%'}}>
          <Text style={styles.title}>Please select 1 or more roles</Text>

          <CheckboxRow name="Maker" key="maker" 
            value={maker} valueChanged={makerChanged} />
          <CheckboxRow name="Courier" key="courier"
            value={courier} valueChanged={courierChanged} />
        
        </View>

        <Button text="Continue" buttonStyle={styles.button}
          buttonStyle={[generalStyle.primaryButton, styles.button]}
          textStyle={generalStyle.primaryButtonText}
          onPress={continueClicked} />

      </View>
    </BasePage>
  )

}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    height: '90%',
  },
  title: {
    fontSize: 22,
  },
  button : {
    width: 150,
  },
  tip: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  }
});