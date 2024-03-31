import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import AuthContent from '../companents/AuthContent'
import Loading from '../companents/Loading'
import { login } from '../util/auth'
import { AuthContext } from '../store/auth-context'

export default function LoginScreen() {

  const [isAuthanticated, setIsAuthanticated] = useState(false);
  const authContext = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthanticated(true);
    try {
      const token = await login(email, password);
      authContext.authenticate(token);
    } catch (error) {
      Alert.alert('Giriş Yapılamadı!', 'Lütfen bilgilerinizi kontrol edin')
    }

    setIsAuthanticated(false);
  }

  if (isAuthanticated) {
    return <Loading message={"Giriş Yapılıyor..."}
    />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />
}

const styles = StyleSheet.create({})