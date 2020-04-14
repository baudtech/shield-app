import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const defaultSize = 18;

export default function Button(props) {

  function handlePress() {
    props.onPress();
  }

  const item = props.hasIcon ? (
    <Icon name={props.text}
      color={props.color ? props.color : 'black'}
      size={props.size ? props.size : defaultSize}
      style={styles.icon} />
    ) : (
    <Text
      style={[props.textStyle, styles.text,
        {fontSize: props.size ? props.size : defaultSize}]}>
      {props.text}
    </Text>
  )

  return (
    <TouchableOpacity
      style={[props.buttonStyle, styles.button]}
      onPress={handlePress}>

      {item}      

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center'
  }
});