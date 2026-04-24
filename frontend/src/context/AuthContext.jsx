import { createContext, useState, useEffect, useContext } from 'react'
import api from "./api.js"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if token is in URL from OAuth callback
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      fetchUser();
    } else {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);