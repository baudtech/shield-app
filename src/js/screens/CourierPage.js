import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import MapView, { Marker, Callout } from 'react-native-maps';
import openMap, { createOpenLink } from 'react-native-open-maps';

import BasePage from './BasePage';
import Button from '../components/Button';

import { Database } from '../utils/DatabaseUtils';

var profiles = null;
var makers = null;

export default function CourierPage(props) {
  const [markers, setMarkers] = useState([]);

  if (props.extraData.role.includes("courier_request")) {
    return (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>Your request is being processed…</Text>
      </View>
    )
  }

  useEffect(() => {
    const profilesSubscriber = Database().ref('/profiles').on('value', snapshot => {
      if (!snapshot) return;

      profiles = snapshot.val();
      populateData();
    });

    const makersSubscriber = Database().ref('/makers').on('value', snapshot => {
      if (!snapshot) return;

      makers = snapshot.val();
      populateData();
    });


    // this function has replaced componentWillUnmount
    return () => {
      profilesSubscriber();
      makersSubscriber();
    };
  }, [])

  function populateData() {
    if (!profiles || !makers) return;

        const makersObjects = Object.entries(makers);

    var uid = "";
    var production = {};
    const makersArray = [];

    for (var i = 0; i < makersObjects.length; i++) {
      uid = makersObjects[i][0];
      production = Object.entries(makersObjects[i][1]);

      const totalProduction = 0;
      const prodArray = [];
      for (var p = 0; p < production.length; p++) {
        totalProduction = totalProduction + production[p][1];

        prodArray.push({
          id: production[p][0],
          quantity: production[p][1]
        });
      }

      makersArray.push({
        user: uid,
        profile: profiles[uid],
        production: prodArray,
        totalProduction: totalProduction
      });
    }

    makersArray.sort((a, b) => (a.totalProduction > b.totalProduction) ? -1 : 1);

    setMarkers(makersArray);
  }

  const CustomCallout = ({marker}) => {
    const openMaps = () => {
      const query = Platform.OS === 'ios' ? marker.profile.address : `${marker.profile.coordinates.latitude},${marker.profile.coordinates.longitude}`

      openMap({
        latitude: marker.profile.coordinates.latitude,
        longitude: marker.profile.coordinates.longitude,
        end: marker.profile.address,
        query: query
      });
    }

    return (
      <Callout onPress={openMaps}>
        <View style={styles.callout}>
          <Text style={styles.calloutText}>{marker.profile.name}</Text>
          <Text style={styles.calloutText}>{marker.profile.address}</Text>
          <Text style={styles.calloutText}>{marker.profile.phone}</Text>
          <Text style={styles.calloutText}>Total production: {marker.totalProduction}</Text>

          <Text style={[styles.calloutText, styles.hint]}>Tap to get directions</Text>
        </View>
      </Callout>
    )
  }

  const CustomMarker = ({marker}) => {
    return (
      <Marker
        coordinate={marker.profile.coordinates}
        title={marker.profile.name}
        flat={true}
        style={styles.marker}
        >
        <View>
          <Text style={styles.markerText}>{marker.totalProduction}</Text>
        </View>

        <CustomCallout marker={marker} />        
      </Marker>
    )
  }

  const QRButton = ({ navigation }) => {
    function showQR() { navigation.navigate("QRCodeModal") }

    return <Button hasIcon text="md-barcode" size={24} buttonStyle={styles.qrButton} onPress={showQR} />
  }

  return (
    <BasePage title="Courier" leftButton={<QRButton navigation={props.navigation} />}>
      
      <MapView
        style={styles.container}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
      >

      {markers.filter(person => person.totalProduction > 0 && person.profile != null).map(marker => (
        <CustomMarker marker={marker} key={marker.user}/>
      ))}

      </MapView>

    </BasePage>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  markerText: {
    fontSize: 18,
    color: '#005290',
  },
  callout: {
    width: 250,
    padding: 5,
  },
  calloutText: {
    fontSize: 18,
  },
  hint: {
    alignSelf: 'center',
    marginTop: 15,
    fontWeight: '500'
  },
  loadingView: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 22,
    padding: 30,
    textAlign: 'center',
  },
  qrButton: {
    position: 'absolute',
    left: 0,
    marginLeft: 15,
  },
});