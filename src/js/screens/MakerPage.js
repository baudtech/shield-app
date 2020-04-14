import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import BasePage from './BasePage';
import Button from '../components/Button';
import ProductionRow from '../components/ProductionRow';

import {
  GetQuantity,
  CreateProduction,
} from '../utils/DatabaseUtils';

import {
  toolTypes,
  maskModels,
  materials,
} from '../../appData';

export default function MakerPage() {
  const [profile, setProfile] = useState({});
  const [type, setType] = useState({});
  const [production, setProduction] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [dropdownData, setDropdownData] = useState([]);

  useEffect(() => {
    GetQuantity((production) => {
      if (production == null) {
        return;
      }

      const items = Object.entries(production);
      const prod = [];

      for (var i = 0; i < items.length; i++) {
        const id = items[i][0];
        const types = id.split(",");

        prod.push({
          id: id,
          tool: types[0],
          mask: types[1],
          material: types[2],
          quantity: items[i][1]
        });
      }

      setProduction(prod);
    });
  }, []);

  function addNewProduction() {
    const empty = type.tool == null || type.mask == null || type.material == null;
    setType({});
    if (empty) return;

    const item = {...type,
      id: type.tool + "," + type.mask + "," + type.material,
      quantity: 0,
    };

    const exists = production.find(x => x.id === item.id);
    if (exists) return;

    CreateProduction(item.id, (success) => {
      setProduction(prevState => [...prevState, item]);
    });
  }

  function removeClicked(item) {
    setProduction(production.filter(x => x.id !== item.id));
  }

  function toggleDropdownOverlay() { setShowOverlay(!showOverlay) }

  function toggleTools() {
    setDropdownData(toolTypes);
    toggleDropdownOverlay();
  }

  function toggleMasks() {
    setDropdownData(maskModels);
    toggleDropdownOverlay();
  }

  function toggleMaterials() {
    setDropdownData(materials);
    toggleDropdownOverlay();
  }

  function dropdownItemSelected(item) {
    if (toolTypes.includes(item)) {
      setType({...type, tool: item.value});
    }
    else if (maskModels.includes(item)) {
      setType({...type, mask: item.value});
    }
    else if (materials.includes(item)) {
      setType({...type, material: item.value});
    }

    toggleDropdownOverlay();
  }

  function DropdownHeader(props) {
    return (
      <TouchableOpacity onPress={props.onPress} style={styles.dropdownContainer}>
        <Text style={styles.text}>{props.value ? props.value : props.placeholder}</Text>
        <Icon name="md-arrow-dropdown" size={16} style={styles.dropdownIcon}/>
      </TouchableOpacity>
    );
  }

  function DropdownItem(props) {
    function itemSelected() { dropdownItemSelected(props.item) };

    return (
      <TouchableOpacity style={styles.dropdownItem} onPress={itemSelected}>
        <Text style={styles.dropdownText}>{props.item.value}</Text>
      </TouchableOpacity>
    )
  }

  /*
   * Render flow 
   */

  return (
    <BasePage title="Maker" pageStyle={{padding: 15, paddingTop: 0}}>

        <View style={[styles.addRow, styles.typeRow]}>
          <DropdownHeader placeholder="Tool" value={type.tool} onPress={toggleTools} />
          <DropdownHeader placeholder="Mask" value={type.mask} onPress={toggleMasks} />
          <DropdownHeader placeholder="Material" value={type.material} onPress={toggleMaterials} />

          <Button text="Add" buttonStyle={styles.addButton}
            onPress={addNewProduction}/>
        </View>

        <Text style={styles.header}>Production</Text>

        <FlatList
          data={production}
          renderItem={({ item }) => {
            return (
              <ProductionRow item={item} onRemove={removeClicked} />
            )
          }}
          keyExtractor={item => item.id}
        />

        { showOverlay &&
          <View style={styles.dropdownOverlay}>
            <Text style={styles.dropdownTitle}>Select one:</Text>
            <FlatList
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
              data={dropdownData}
              renderItem={({ item }) => <DropdownItem item={item} />}
              keyExtractor={item => item.value}
            />
          </View>
        }

    </BasePage>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loading: {
    fontSize: 22,
    textAlign: 'center',
  },
  productionRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 40,
  },
  header: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 22,
  },
  materialsRow: {
    flexDirection: 'column',
  },
  addRow: {
    height: 60,
    zIndex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    height: 50,
  },
  addButton: {
    width: 50,

    alignSelf: 'center',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0, 
    right: 0,
    zIndex: 1,
    backgroundColor: 'white',
  },
  dropdownContainer: {
    width: '26%',
    height: 40,

    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  dropdownHeader: {
    width: '100%',
    justifyContent: 'center',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 5,
  },
  dropdownItem: {
    height: 40,
    width: "50%",
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    alignSelf: 'center',
    marginTop: 20
  },
  dropdownText: {
    textAlign: 'center',
    fontSize: 16,
  },
  dropdownTitle: {
    alignSelf: 'center',
    fontSize: 22,
  }
});

