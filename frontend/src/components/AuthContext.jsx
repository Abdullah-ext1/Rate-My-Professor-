import { createContext, useState, useEffect } from 'react'
import axios from 'axios';
import { api } from '../Api/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.get('/auth/me', { withCredentials: true })
    .then(response => {
      setUser(response.data.data)
      console.log(response.data.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    }); 


  }, [])
;
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthContext = createContext()