import React from 'react';

import BasePage from './BasePage';
import SettingsForm from '../components/SettingsForm';

export default function RolePage(props) {

  return (
    <BasePage title="Choose your Role" pageStyle={{padding: 30, paddingTop: 15}}>
      <SettingsForm buttonText="Continue" setRole={props.setRole}/>
    </BasePage>
  )

}