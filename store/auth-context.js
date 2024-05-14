import React, { createContext, useState, useEffect } from "react";
import { BackHandler } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from '../firebase';

export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  authenticate: (token) => { },
  logout: () => { },
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);

  useEffect(() => {
    async function checkToken() {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        setIsAuthenticated(true);
      }
    }
    checkToken();
    const backAction = () => {
      setIsBackButtonPressed(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (authToken) {
      AsyncStorage.setItem('token', authToken);
      setIsAuthenticated(true);
    }
  }, [authToken]);

  useEffect(() => {
    if (isBackButtonPressed && !auth.currentUser) {
      setAuthToken(null);
      AsyncStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, [isBackButtonPressed]);

  const authenticate = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        const userDocRef = db.collection('Kullanicilar').doc(auth.currentUser.email);
        await userDocRef.update({
          status: 'offline'
        });
      }

      setAuthToken(null);
      AsyncStorage.removeItem('token');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Kullanıcı durumu güncellenirken bir hata oluştu:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token: authToken, isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;