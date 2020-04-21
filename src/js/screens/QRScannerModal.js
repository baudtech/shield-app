import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

import Toolbar from '../components/Toolbar';

import { CompletePickup } from '../utils/DatabaseUtils';

export default function QRScannerModal(props) {

  function qrRead(content) {
    CompletePickup(content.data, props.route.params.productionID, (success) => {
      props.navigation.goBack();
    })
  }

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>

      <Toolbar closeButton title="" />

      <Text style={styles.hint}>Scan the Courier's QR Code to complete the pick up.</Text>

      <QRCodeScanner
        onRead={qrRead}
        containerStyle={styles.qrscanner}
        fadeIn={false}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  qrscanner: {
    backgroundColor: 'white',
  },
  hint: {
    backgroundColor: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
})