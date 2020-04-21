import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import QRCode from 'react-native-qrcode-svg';

import Toolbar from '../components/Toolbar';

import { ProfileContext } from '../context/ProfileContext';

export default function QRCodeModal() {
  const profile = useContext(ProfileContext)[0];

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>

      <Toolbar closeButton title="" />

      <View style={styles.container}>
        <Text style={styles.hint}>When picking up an order, let the maker scan your QR code.</Text>

        <View style={styles.qrContainer}>
          <QRCode value={profile.uuid} size={200}/>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
  },
  hint: {
    fontSize: 18,
    textAlign: 'center',
    height: 50,
  },
  qrContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
})