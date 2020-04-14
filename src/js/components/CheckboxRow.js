import React,  { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function CheckboxRow(props) {
  const changed = () => {
    props.valueChanged(props.val);
  }

  return (
    <View style={styles.checkboxRow}>
      <Text style={styles.checkBoxTitle}>{props.name}</Text>
      <Switch style={styles.checkBox} thumbColor="whitesmoke" trackColor={{true: "#005290"}}
        value={props.value} onValueChange={changed}/>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkBox: {
    marginRight: 10,
  },
  checkBoxTitle: {
    fontSize: 18,
    lineHeight: 40,
    width: 100,
  },
})