import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status when the component mounts
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('userName');
      
      // Update isLoggedIn based on the presence of the token
      setIsLoggedIn(token !== null);
    } catch (error) {
      // Handle errors if any
      console.error('Error checking login status:', error);
    }
  };

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, checkLoginStatus }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;