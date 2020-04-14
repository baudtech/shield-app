import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import Toolbar from '../components/Toolbar';

export default function BasePage(props) {

  return (
    <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
      <Toolbar title={props.title}/>

      <View style={[props.pageStyle, {flex: 1} ]}>
        {props.children}
      </View>
    </View>
  )

}