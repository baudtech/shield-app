import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import Button from './Button';
import { generalStyle } from '../utils/Theme';

export default function Toolbar(props) {

  const navigation = useNavigation();

  const onHelpButton = event => {
    navigation.navigate("HelpModal");
  }

  const onCloseButton = event => {
    navigation.navigate("Main");
  }

  return (
    <View style={styles.toolbarContainer}>
      <Text style={generalStyle.screenHeader}>{props.title}</Text>

      {!props.hideButton &&
        <Button buttonStyle={styles.helpButton} hasIcon
          text={props.closeButton ? "md-close" : "md-settings"} size={28}
          onPress={props.closeButton ? onCloseButton : onHelpButton} /> }

    </View>
  )

}

const styles = StyleSheet.create({
  toolbarContainer: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  helpButton: {
    position: 'absolute',
    right: 0,
    marginRight: 15,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    height: 1,
    width: '100%',
    backgroundColor: 'black',
  }
});