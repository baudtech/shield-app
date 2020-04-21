import React, { useState, useEffect, useContext } from 'react'

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from '.';
import { GetProfile, SetUser, SetUUID } from '../utils/DatabaseUtils';

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

        // create a uuid for this user
        if (!profile.uuid) {
          const uuid = uuidv4();
          SetUUID(uuid, (success) => {
            profile.uuid = uuid;
            setProfile(profile);
          })
        }
        else {
          setProfile(profile);
        }
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