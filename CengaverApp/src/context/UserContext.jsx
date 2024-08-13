import React, { createContext, useState, useContext } from 'react';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [logged, setLogged] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, logged, setLogged }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
