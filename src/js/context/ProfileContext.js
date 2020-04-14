import React, { useState, useEffect, useContext } from 'react'

import { UserContext } from './UserContext';
import { GetProfile, SetUser } from '../utils/DatabaseUtils';

const initalState = {
  name: '',
  address: '',
  phone: ''
};

const ProfileContext = React.createContext([{}, () => {}]);

const ProfileContextProvider = (props) => {
  const [profile, setProfile] = useState(initalState);
  const user = useContext(UserContext)[0];

  useEffect(() => {
    if (user != null) {
      SetUser(user);

      GetProfile((profile) => {
        if (profile == null) return;

        profile.phone = profile.phone.toString();
        setProfile(profile);
      });
    }
  }, [user])

  return (
    <ProfileContext.Provider value={[profile, setProfile]}>
      {props.children}
    </ProfileContext.Provider>
  )
}


export { ProfileContext, ProfileContextProvider }