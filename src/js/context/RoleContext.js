import React, { useState, useEffect, useContext } from 'react'

import { GetRole } from '../utils/DatabaseUtils';
import { UserContext } from '.';

const RoleContext = React.createContext([null, () => {}]);

const RoleContextProvider = (props) => {
	const user = useContext(UserContext)[0];
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user == null) {
      if (role != null) {
        setRole(null);
      }

      return;
    }

  	GetRole((role) => {
      setRole(role);
    })
  }, [user])

  return (
    <RoleContext.Provider value={[role, setRole]}>
      {props.children}
    </RoleContext.Provider>
  )
}


export { RoleContext, RoleContextProvider }