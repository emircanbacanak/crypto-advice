import React, { useState ,useContext } from 'react'
import AuthContent from '../companents/AuthContent'
import { createUser } from '../util/auth'
import { StyleSheet, Alert } from 'react-native'
import Loading from '../companents/Loading'
import { AuthContext } from '../store/auth-context'

export default function SignupScreen() {
  const [isAuthanticated, setIsAuthanticated] = useState(false);
  const authContext=useContext(AuthContext);
  async function signUpHandler({ email, password }) {

    setIsAuthanticated(true);
    try {
      const token = await createUser(email, password);
      authContext.authenticate(token);
    } catch (error) {
      Alert.alert('Kayıt Olunamadı!', 'Lütfen bilgilerinizi kontrol edin')
    }

    setIsAuthanticated(false);
  }
  if (isAuthanticated) {
    return <Loading message={"Kullanıcı Oluşturuluyor..."} />
  }
  return <AuthContent onAuthenticate={signUpHandler} />;
}

const styles = StyleSheet.create({});