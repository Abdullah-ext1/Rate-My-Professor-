import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState();

  async () => {
    useEffect(() => {
    try {
      const response = axios.get("http://localhost:9000/api/auth/me", {withCredentials: true})
      console.log(response.data)
      setUser(response.data.data)
      setUser({ name: username });
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Error while loggingIn")
    }
    }, [])
  }
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

