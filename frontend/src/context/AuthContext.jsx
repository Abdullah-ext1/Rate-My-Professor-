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
      localStorage.removeItem('token'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if token is in URL from OAuth callback
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      
      // ADD THIS: Remove the token from the URL so it doesn't linger
      window.history.replaceState({}, document.title, window.location.pathname);

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