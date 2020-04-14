import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Linking, TouchableWithoutFeedback, TextInput } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import openMap, { createOpenLink } from 'react-native-open-maps';

import BasePage from './BasePage';
import Button from '../components/Button';

import {
  Database
} from '../utils/DatabaseUtils';

const CoordinatorStack = createStackNavigator();

var profiles = null;
var makers = null;
var userDetails = null;

function CoordinatorList({ navigation }) {
  const [people, setPeople] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    if (!search) {
      setPeople(originalData);
      return;
    }

    var item;
    const data = [];
    for (var i = 0; i < originalData.length; i++) {
      item = originalData[i];

      if (item.profile.name.toLowerCase().includes(search)) {
        data.push(item);
      }
      else if (item.profile.address.toLowerCase().includes(search)) {
        data.push(originalData[i]);
      }
      else if (item.profile.phone.toLowerCase().includes(search)) {
        data.push(originalData[i]);
      }
    }

    setPeople(data);
  }, [originalData, search])

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

    setOriginalData(makersArray);
  }

  return (
    <BasePage title="Coordinator" pageStyle={{paddingTop: 20}}>

      <View style={styles.container}>
        <TextInput style={styles.search} placeholder="Search..." autoCapitalize="none"
          onChangeText={text => setSearch(text)} value={search} />

        <View style={styles.divider}/>

        <FlatList
          style={styles.list}
          data={people}
          renderItem={({ item }) => (
            <MakerItem data={item} navigation={navigation} />
          )}
          keyExtractor={item => item.user}
        />
      </View>

    </BasePage>
  )
} 

const MakerItem = ({ navigation, data }) => {
  if (data.profile == null) {
    return (
      <View style={styles.rowItem}>
        <Text>Profile information is missing</Text>
      </View>
    );
  }

  function openDetails() {
    userDetails = data;
    navigation.navigate("Details");
  }

  return (
    <TouchableWithoutFeedback onPress={openDetails}>
      <View style={styles.rowItem}>
        <View style={styles.info}>
          <Text>{data.profile.name}</Text>
          <Text>{data.profile.address}</Text>
          <Text>{data.profile.phone}</Text>
        </View>

        {data.totalProduction != null && <Text style={styles.quantity}>{data.totalProduction}</Text>}
      </View>
    </TouchableWithoutFeedback>
  )
}

function DetailsView(props) {
  if (userDetails == null) {
    props.navigation.navigate("CoordinatorList");
    return null;
  }

  function goToMaps() {
    const query = Platform.OS === 'ios' ?
      userDetails.profile.address :
      `${userDetails.profile.coordinates.latitude},${userDetails.profile.coordinates.longitude}`

    openMap({
      latitude: userDetails.profile.coordinates.latitude,
      longitude: userDetails.profile.coordinates.longitude,
      end: userDetails.profile.address,
      query: query
    });
  }

  function call() {
    Linking.openURL(`tel:${userDetails.profile.phone}`);
  }

  return (
    <BasePage title="Details" pageStyle={{paddingTop: 20}}>

      <View style={styles.container}>

        <View style={styles.detailsInfo}>
          <Text style={styles.detailsText}>{userDetails.profile.name}</Text>
          <Text style={styles.detailsText}>{userDetails.profile.address}</Text>
          <Text style={styles.detailsText}>{userDetails.profile.phone}</Text>

          <View style={styles.detailsButtonsRow}>
            <Button text="Directions" buttonStyle={styles.detailsButton}
              textStyle={styles.detailsButtonText} onPress={goToMaps}/>
            <Button text="Call" buttonStyle={styles.detailsButton}
              textStyle={styles.detailsButtonText} onPress={call}/>
          </View>
        </View>

        <FlatList
          data={userDetails.production}
          renderItem={({ item }) => <Text style={styles.detailsProduction}>{item.id}: {item.quantity}</Text>}
          keyExtractor={item => item.id}
          />
      </View>

    </BasePage>
  )
} 

export default function CoordinatorPage() {
  return (
    <CoordinatorStack.Navigator headerMode="none">
      <CoordinatorStack.Screen name="CoordinatorList" component={CoordinatorList} />
      <CoordinatorStack.Screen name="Details" component={DetailsView} />
    </CoordinatorStack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  rowItem: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
  },
  list: {
    flex: 1,
  },
  info: {
    justifyContent: 'center'
  },
  quantity: {
    fontSize: 18,
    alignSelf: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  search: {
    height: 35,
    marginRight: 30,
    marginLeft: 30,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  detailsText: {
    fontSize: 18,
    height: 30,
    lineHeight: 30,
  },
  detailsInfo: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  detailsProduction: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    height: 24,
    lineHeight: 24,
  },
  detailsButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    width: 100,
    backgroundColor: '#005290',
    marginTop: 10,
    marginBottom: 10,
  },
  detailsButtonText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
  }
});