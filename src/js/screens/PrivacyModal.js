import React from 'react';
import { View, Text } from 'react-native';

import Toolbar from '../components/Toolbar';

export default function PrivacyModal() {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>

      <Toolbar closeButton title="" />

      <View style={{padding: 30, flex: 1, backgroundColor: 'white'}}>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>Terms and Conditions and Privacy Policy</Text>

        <Text style={{textAlign: 'center', marginTop: 50}}>{privacyPolicy}</Text>
      </View>

    </View>
  )
}

const privacyPolicy = `This is a free, open source, community app.

The app is provided as-is, with no warranty that it works or that it handles data in a proper manner.

Any data shared via this app is stored on a Google Firebase account, managed by the community using this app. The data may be visible to the administrators of this community.

Please contact your community administrators if you have any further questions.`