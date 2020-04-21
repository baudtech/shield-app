import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

import Geocoder from 'react-native-geocoder';

import Button from '../components/Button';
import ProfileForm from '../components/ProfileForm';
import CheckboxRow from '../components/CheckboxRow';

import { generalStyle } from '../utils/Theme';

import { UpdateRole, UpdateProfile } from '../utils/DatabaseUtils';
import { ProfileContext, RoleContext } from '../context';

export default function SettingsForm(props) {
  let userProfile;

  const [maker, setMaker] = useState(false);
  const [courier, setCourier] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useContext(ProfileContext);
  const [role, setRole] = useContext(RoleContext);

  makerChanged = () => { setMaker(!maker); }
  courierChanged = () => { setCourier(!courier); }

  useEffect(() => {
    if (role == null) return;

    setMaker(role.maker);
    setCourier(role.courier || role.courier_request);
  }, [role])

  useEffect(() => {
    userProfile = profile;
  }, [profile])

  const continueClicked = () => {
    if (!profile || !profile.name || !profile.address || !profile.phone) {
      setError("Please fill out your details.");
      return;
    }
    if (!maker && !courier) {
      setError("Please select at least one role.");
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
      if (!success) return;

      const newRole = {};
      newRole.maker = maker;
      newRole.courier = false;
      newRole.courier_request = courier;
      newRole.coordinator = role.coordinator;

      setRole(newRole);
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
    <View style={styles.container}>

      <ProfileForm hideButton onChange={profileChanged}/>

      <View style={{width: '100%', marginTop: 20}}>
        <Text style={styles.title}>Please select 1 or more roles</Text>

        <CheckboxRow name="Maker" key="maker" 
          value={maker} valueChanged={makerChanged} />
        <CheckboxRow name="Courier" key="courier"
          value={courier} valueChanged={courierChanged} />
      
      </View>

      <Text style={{color: 'red'}}>{error}</Text>
      <Button text={props.buttonText} buttonStyle={styles.button}
        buttonStyle={[generalStyle.primaryButton, styles.button]}
        textStyle={generalStyle.primaryButtonText}
        onPress={continueClicked} />

    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  title: {
    fontSize: 22,
  },
  button : {
    width: 150,
    marginBottom: 10,
  },
  tip: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  }
});