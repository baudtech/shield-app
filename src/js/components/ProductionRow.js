import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import Button from '../components/Button';

import {
  IncreaseQuantity,
  DecreaseQuantity,
  RemoveProduction,
} from '../utils/DatabaseUtils';

export default function ProductionRow(props) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    setQuantity(props.item.quantity);
  }, []);

  function removeClicked() {
    RemoveProduction(props.item.id, (success) => {
      props.onRemove(props.item);
    });
  }

  function increaseClicked() { 
    IncreaseQuantity(props.item.id, (quantity) => {
      setQuantity(quantity);
    })
  }

  function decreaseClicked() {
    if (quantity === 0) return;

    DecreaseQuantity(props.item.id, (quantity) => {
      setQuantity(quantity);
    })
  }

  return (
    <View style={styles.makerRow}>
      <View style={[styles.typeRow, styles.productionTypeRow]}>
        <Text style={styles.productionType}>{props.item.tool}</Text>
        <Text style={styles.productionType}>{props.item.mask}</Text>
        <Text style={styles.productionType}>{props.item.material}</Text>
      </View>

      <View style={styles.typeRow}>
        <View style={{flexDirection: 'row'}}>
          <Button text="md-remove-circle-outline" hasIcon size={24} color="#005290"
            onPress={decreaseClicked} buttonStyle={[styles.rowButton, styles.rightMargin]} />

          <TextInput editable={false}
            style={styles.productionText}
            value={quantity.toString()} />

          <Button text="md-add-circle-outline" hasIcon size={24} color="#005290"
            onPress={increaseClicked} buttonStyle={[styles.rowButton, styles.leftMargin]}/>
        </View>

        <Button hasIcon text="md-trash" size={22} color="#A5282C"
          buttonStyle={styles.removeButton} onPress={removeClicked}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  productionTypeRow: {
    height: 30,
  },
  typeRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    height: 50,
  },
  makerRow: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  productionText: {
    height: 40,
    width: 60,
    textAlign: 'center',
    alignSelf: 'center',

    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',

    fontSize: 18,
  },
  rowButton: {
    width: 40,
    alignSelf: 'center',
  },
  leftMargin: {
    marginLeft: 10,
  },
  rightMargin: {
    marginRight: 10,
  },
  productionType: {
    fontSize: 18
  },
  removeButton: {
    width: 40,
    alignSelf: 'center',
    alignSelf: 'center',
  },
});

