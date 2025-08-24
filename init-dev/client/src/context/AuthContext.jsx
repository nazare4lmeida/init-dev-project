import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (userData) => {
    const response = await axios.post('/api/users/login', userData);
    const loggedInUser = response.data;
    if (loggedInUser.token) {
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    }
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (userData) => {
    const response = await axios.post('/api/users', userData);
    const registeredUser = response.data;
    if (registeredUser.token) {
      localStorage.setItem('user', JSON.stringify(registeredUser));
    }
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const enroll = async (enrollData) => {
    const response = await axios.post('/api/enroll', enrollData);
    return response.data;
  }
  
  const requestAccess = async (accessData) => {
    const response = await axios.post('/api/access', accessData);
    return response.data;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, enroll, requestAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;